const WebpackBeforeBuildPlugin = require('before-build-webpack');
const fs = require('fs');

class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor({filename, interval = 100, timeout = 10000}) {
    super(function(_, callback) {
      let start = Date.now();

      function poll() {
        if (fs.existsSync(filename)) {
          console.log('FOUND IT');
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error(`${filename} not found within ${timeout}ms.`);
        } else {
          console.log('waiting', filename);
          setTimeout(poll, interval);
        }
      }

      poll();
    })
  }
}

module.exports = WaitPlugin;
