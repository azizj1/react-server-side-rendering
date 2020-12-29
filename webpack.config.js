const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WaitPlugin = require('./webpack-util/waitplugin');
const ZipDirectoryPlugin = require('./webpack-util/ZipDirectoryPlugin');

const STYLELINT_CONFIG = {
    files: 'src/**/*.scss',
    syntax: 'scss'
};
const BUILD_DIR = path.join(__dirname, 'build');
const STATS = {
    colors: true,
    reasons: false,
    hash: false,
    version: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    cached: false,
    cachedAssets: false,
    children: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    warningsFilter: /^(?!CriticalDependenciesWarning$)/
};

// for css-loader
function cssConfig(modules, debug) {
    return {
        sourceMap: debug,
        modules,
        localIdentName: debug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
        minimize: !debug
    };
}

function getVendors(directory, currentListOfVendors) {
    currentListOfVendors = currentListOfVendors || [];
    fs.readdirSync(directory).forEach(file => {
        if (fs.statSync(directory + file).isDirectory())
            currentListOfVendors = getVendors(directory + file + '/', currentListOfVendors);
        else if (['.css', '.scss', '.js'].includes((path.extname(file) || '').toLowerCase()))
            currentListOfVendors.push(directory + file);
    });
    return currentListOfVendors;
}

const vendors = getVendors('./vendor/', ['babel-polyfill', 'whatwg-fetch']);

const moduleRules = (debug, babelConfig) => [
{
    test: /\.tsx?$/,
    enforce: 'pre',
    use: 'tslint-loader',
    include: path.join(__dirname, 'src')
},
{
    test: /\.tsx?$/,
    exclude: [
        /node_modules/,
        path.join(__dirname, 'vendor')
    ],
    use: [
        {
            loader: 'babel-loader',
            options: babelConfig
        },
        {
            loader: 'ts-loader',
            options: { silent: true }
        }
    ]
},
{
    test: /\.scss$/,
    include: /src/,
    use: [
        'isomorphic-style-loader',
        {
            loader: 'css-loader',
            options: cssConfig(true, debug)
        },
        {
            loader: 'postcss-loader',
            options: { sourceMap: debug }
        },
        {
            loader: 'sass-loader',
            options: { sourceMap: debug, includePaths: [path.join(__dirname, 'src/client/shared/styles/')] }
        }
    ]
},
{
    test: /\.css$/,
    include: /(vendor|node_modules[\\\/]react-select|node_modules[\\\/]rc-slider)/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: cssConfig(false, debug)
        },
        {
            loader: 'postcss-loader',
            options: { sourceMap: debug }
        }
    ]
},
{
    test: /\.scss$/,
    include: /vendor/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: cssConfig(false, debug)
        },
        {
            loader: 'postcss-loader',
            options: { sourceMap: debug }
        },
        {
            loader: 'sass-loader',
            options: { sourceMap: debug }
        }
    ]
}];

const BABEL_PLUGINS = (debug) => [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/transform-runtime',
  'lodash',
  ...debug ? [] : [
      'transform-react-remove-prop-types',
      '@babel/plugin-transform-react-constant-elements'
  ]
];

const RESOLVE = {
  alias: {
      '~': path.join(__dirname, 'src')
  },
  extensions: ['*', '.tsx', '.ts', '.jsx', '.js', '.json']
};

serverConfig = function (env) {
    const DEBUG = env !== 'prod' && env !== 'dev';
    const BABEL_CONFIG = {
        babelrc: false,
        presets: [
            '@babel/react',
            ['@babel/env', { 'targets': { 'node': '8.10' } }]
        ],
        plugins: BABEL_PLUGINS(DEBUG),
        cacheDirectory: DEBUG
    };
    const GLOBALS = {
        'process.env.NODE_ENV': JSON.stringify(DEBUG ? 'local' : env === 'prod' ? 'production' : 'development')
    };

    const config = {
        mode: DEBUG ? 'development' : 'production',
        target: 'node',
        node: {
            __dirname: false
        },
        entry: DEBUG ?
            { 'local': './src/bin/www.ts' } :
            { 'lambda': './src/bin/lambda.ts' }
        ,
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
            publicPath: '/',
            ... DEBUG ? {} : {
                libraryTarget: 'commonjs2'
            }
        },
        resolve: RESOLVE,
        module: {
            rules: moduleRules(DEBUG, BABEL_CONFIG)
        },
        plugins: [
            new webpack.DefinePlugin(GLOBALS),
            new MiniCssExtractPlugin({filename: '[name].css?[contenthash]'}),
            new AssetsPlugin({ path: BUILD_DIR, filename: 'server-assets.json'}),
            new StyleLintPlugin(STYLELINT_CONFIG),
            ... DEBUG ? [] : [
                new CleanPlugin([BUILD_DIR]),
            ],
        ],
        cache: DEBUG,
        stats: STATS
    };

    return config;
}

clientConfig = function (env) {
    const DEBUG = env !== 'prod' && env !== 'dev';
    const GLOBALS = {
        'process.env.NODE_ENV': JSON.stringify(DEBUG ? 'development' : 'production'),
        __DEV__: JSON.stringify(DEBUG),
    };
    const BABEL_CONFIG = {
        babelrc: false,
        presets: [
            '@babel/react',
            ['@babel/env']],
        plugins: BABEL_PLUGINS(DEBUG),
        cacheDirectory: DEBUG
    };
    const config = {
        mode: DEBUG ? 'development' : 'production',
        entry: {
          'main': [...vendors, './src/client/main.tsx'],
        },
        output: {
            path: path.join(BUILD_DIR, 'public'),
            filename: '[name].js?[chunkhash]',
            publicPath: '/'
        },
        devtool: DEBUG ? 'inline-source-map' : false,
        devServer: {
            contentBase: BUILD_DIR,
            stats: STATS,
            historyApiFallback: true
        },
        resolve: RESOLVE,
        module: {
            rules: moduleRules(DEBUG, BABEL_CONFIG)
        },
        plugins: [
            new CleanPlugin([BUILD_DIR]),
            new AssetsPlugin({ path: BUILD_DIR, filename: 'client-assets.json'}),
            new StyleLintPlugin(STYLELINT_CONFIG),
            new webpack.DefinePlugin(GLOBALS),
            new MiniCssExtractPlugin({filename: '[name].css?[contenthash]'}),
        ],
        optimization: {
          splitChunks: {
              chunks: 'all'
          }
        },
        performance: {
            hints: false
        },
        cache: DEBUG,
        stats: STATS
    };

    return config;
}

const lambdaConfig = {
  mode: 'none',
  entry: './webpack-util/empty.js',
  output: {
    path: BUILD_DIR,
    filename: 'empty.js',
  },
  plugins: [
      new WaitPlugin({filename: path.join(BUILD_DIR, 'client-assets.json')}),
      new WaitPlugin({filename: path.join(BUILD_DIR, 'server-assets.json')}),
      new ZipDirectoryPlugin({
        directory: BUILD_DIR,
        zipFileName: 'lambda.zip',
        outputDir: path.join(__dirname, 'terraform/modules/lambda'),
      }),
  ]
};

module.exports = [serverConfig, clientConfig, lambdaConfig];
