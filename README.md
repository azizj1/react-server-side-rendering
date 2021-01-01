# React Server-side Rendering
This app demos how to use React server-side rendering (SSR) on a Node.js backend with the Express framework. It also bundles the web app in a deployable ZIP file to be used with AWS Lambda. The demo includes the following bells and whistles:
* Typescript
* Sass
* Stylelint
* CSS Modules
* Autoprefixer
* Bundling third-party libraries that are only available on CDN. I.e., can't be installed via `npm`.
* Inlining styles critical to the first page render to avoid [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).
* **Isomorphic app.** Albeit not demoed, any further rendering from user navigating the pages would be done by the Javascript running in the browser using SPA techniques.

## Getting Started

### Prerequisites
* Node v12.x+. The project is deployed to AWS Lambda envrionment with node 12.x, so babel polyfills up to that version.
* Yarn globally installed (npm i yarn -g).

### Developing
Install all project dependencies
```
yarn
```

While developing, kick off watcher with hot-reload
```
yarn watch
```

To just run the server locally,
```
yarn start
```

To build a ZIP file for AWS Lambda,
```
yarn build
```

## Project Structure
Client, server, and the AWS Lambda ZIP are all built using Webpack in a [single config file](webpack.config.js). Webpack allows you specify multiple configurations to run in parallel by exporting an array of configs like such:

```
module.exports = [serverConfig, clientConfig, lambdaConfig];
```

### Client
The entrypoint for the client is [main.tsx](src/client/main.tsx). The most important thing in this file is the `ReactDOM.hydrate()` call. This function assumes the HTML is already rendered (presumably by the server), and only adds the event handlers. This allows you to have a performant first-load experience. More details [found here](https://reactjs.org/docs/react-dom.html#hydrate).

The rest of the file builds a markup in VDOM identical to what the server sent, allowing the hydrate to validate actual markup from server and expected markup, completing the "isomorphic handoff" without the client re-rendering the markup again on the client.

This webpack bundles all the css into a single `main.css`, bundles all the app-specific javascript into `main.js`, and finally third-party libraries into `vendor~main.js`. These assets with their respective cache-busting hash are documented in `client-assets.json` that the server can utilize to add into its HTML template.

### Server
The entrypoint for the server is [app.ts](src/app.ts). This configures the ExpressJS framework and adds the routes.

Our [single route](src/routes/index.tsx)
* creates our main [React component](src/client/App.tsx),
* adds in state data via `useContext` React hook,
* renders the main as HTML and adds it to our React [HTML template](src/ssr/html.tsx).
* adds the generated assets from client build into the HTML template, and
* using `isomorphic-style-loader`, adds the css styles used in the initial versin of the main React component in a `<style />` tag in the `<head>` tag.

### AWS Lambda ZIP
This assumes you'll be integrating an `ANY /{proxy}+` method in an API Gateway to a Lambda funtion with this ZIP file. In the lambda function, use the following handler:

```
lambda.handler
```

because for lambda deployment, it outputs a single file called `lambda.js`, which provides a `handler` method for AWS Lambda to hook into.

To pipe the Lambda request to the appropriate ExpressJS route, `aws-serverless-express` npm package is used in [lambda.ts](src/bin/lambda.ts).

Zipping the web app required a couple custom webpack plugins to make it work:
* [WaitPlugin](webpack-util/WaitPlugin.js): Since webpack runs the configs in parallel, we can't zip it right away. We need to wait for server and client builds to complete first. We can discern that once `server-assets.json` and `client-assets.json` appear in the `buid/` directory. This plugin builds off of an existing plugin `before-build-webpack`, which allows the ability to add hooks before build starts.
* [ZipDirectoryPlugin](webpack-util/ZipDirectoryPlugin.js). Uses [yazl](https://github.com/thejoshwolfe/yazl) to zip an entire directory recursively. Existing [plugins](https://github.com/erikdesjardins/zip-webpack-plugin) didn't work because those only zip the assets of the current config, and not the entire BUILD directory. Thus, if I had used this plugin in the server config for example, it would only bundle the express web app, but exclude the assets from the client.

The outupt `lambda.zip` gets stored in `terraform/modules/lambda`.

## License
MIT License

Copyright (c) 2018 Aziz Javed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
