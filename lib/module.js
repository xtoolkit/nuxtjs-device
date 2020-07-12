const {resolve} = require('path');

module.exports = async function module(moduleOptions) {
  const options = Object.assign({}, this.options.storage, moduleOptions);

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'arshen/device.js',
    options
  });

  await this.requireModule('@nuxtjs/universal-storage');
};
