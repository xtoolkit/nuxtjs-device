// eslint-disable-next-line nuxt/no-cjs-in-config
const { resolve } = require('path')

// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  buildDir: resolve(__dirname, '.nuxt'),
  dev: false,
  render: {
    resourceHints: false,
  },
  modules: ['@@'],
}
