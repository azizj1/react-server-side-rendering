const path = require('path');
const fs = require('fs');
const yazl = require('yazl');
const { RawSource } = require('webpack-sources');

class ZipDirectoryPlugin {
  constructor({directory, zipFileName, outputDir}) {
    this.directory = directory;
    this.zipFileName = zipFileName;
    this.outputDir = outputDir;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(ZipDirectoryPlugin.name, (compilation, callback) => {
      // Webpack has child "subprocesses" and parent processes. We only want
      // to do this on the parent.
      if (compilation.compiler.isChild()) {
        callback();
        return;
      }

      const zipfile = new yazl.ZipFile();
      console.log('looking in', this.directory);
      fs.readdir(this.directory, (err, files) => {
        if (err) {
          throw `Unable to read ${this.directory}.`
        }
        files.forEach(file => {
          const fullPath = path.resolve(this.directory, file);
          if (!fs.statSync(fullPath).isDirectory()) {
            console.log('adding file', fullPath);
            zipfile.addFile(fullPath, file);
          }
        });
        const buffers = [];
        zipfile.end();
        zipfile.outputStream.on('data', buff => buffers.push(buff));
        zipfile.outputStream.on('end', () => {
          const outputPathAndFilename = path.resolve(this.outputDir, this.zipFileName);
          // resolve a relative output path with respect to webpack's root output path
          // since only relative paths are permitted for keys in `compilation.assets`
          const relativeOutputPath = path.relative(
            compilation.options.output.path,
            outputPathAndFilename
          );

          console.log('relative', relativeOutputPath);

          // fs.writeFileSync(outputPathAndFilename, Buffer.concat(buffers), 'binary');

          compilation.assets['test.md'] = new RawSource('hello world!');

          callback();
        });
      });
    });
  }
}

module.exports = ZipDirectoryPlugin;
