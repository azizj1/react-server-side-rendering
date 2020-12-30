const path = require('path');
const fs = require('fs');
const yazl = require('yazl');
const glob = require('glob');
const { RawSource } = require('webpack-sources');

class ZipDirectoryPlugin {
  constructor({directory, zipFileName, outputDir}) {
    this.directory = directory;
    this.zipFileName = zipFileName;
    this.outputDir = outputDir;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(ZipDirectoryPlugin.name, (compilation, callback) => {
      // Webpack has child "subprocesses" and parent processes. We only want
      // to do this on the parent.
      if (compilation.compiler.isChild()) {
        callback();
        return;
      }

      const zipfile = new yazl.ZipFile();
      // Will store the zip file in binary as it comes out of the output stream
      // in segments.
      const buffers = [];
      // works better than fs.readdir because this will get all files recursively.
      glob(path.join(this.directory, '/**/*.*'), (err, files) => {
        if (err) {
          throw `Unable to read ${this.directory}.`
        }
        // if directory = /Users/azizj1/proj/build/, then files like
        // /Users/azizj1/proj/build/f1.txt and /Users/azizj1/proj/build/public/f2.txt
        // need to become f1.txt and public/f2.txt in the zip folder.
        for (const f of files) {
          zipfile.addFile(f, path.relative(this.directory, f));
        }
        zipfile.end();
      });
      zipfile.outputStream.on('data', buff => buffers.push(buff));
      zipfile.outputStream.on('end', () => {
        const outputPathAndFilename = path.resolve(this.outputDir, this.zipFileName);
        // resolve a relative output path with respect to webpack's root output path
        // since only relative paths are permitted for keys in `compilation.assets`
        const relativeOutputPath = path.relative(
          compilation.options.output.path,
          outputPathAndFilename,
        );

        compilation.assets[relativeOutputPath] = new RawSource(Buffer.concat(buffers));

        callback();
      });
    });
  }
}

module.exports = ZipDirectoryPlugin;
