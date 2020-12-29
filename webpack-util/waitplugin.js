const WebpackBeforeBuildPlugin = require('before-build-webpack');
const fs = require('fs');

class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor({filename, interval = 100, timeout = 30000}) {
    super(function(_, callback) {
      let start = Date.now();

      function poll() {
        if (fs.existsSync(filename)) {
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error(`${filename} not found within ${timeout}ms.`);
        } else {
          setTimeout(poll, interval);
        }
      }

      poll();
    })
  }
}

module.exports = WaitPlugin;
