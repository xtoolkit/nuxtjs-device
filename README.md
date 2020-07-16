# Nuxtjs User Device information [![npm (scoped with tag)](https://img.shields.io/npm/v/nuxtjs-device/latest.svg?style=flat-square)](https://npmjs.com/package/nuxtjs-device)

> user Device information for Nuxt.js based on [bowser](https://npmjs.com/bowser)

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

- Add `nuxtjs-device` dependency using npm to your project

```sh
npm install nuxtjs-device --save
```

- Add `nuxtjs-device` to the `modules` section of your `nuxt.config.js` file

```js
{
  modules: ['nuxtjs-device'];
}
```

## Usage

`nuxtjs-device` detect all of user device/browser information. You can use this module with \$device insntant.

```js
console.log(this.$device.db)

// output
{
  browser: {
    name: "Firefox",
    version: "78.0",
    touch: false,
    mouse: false,
    ip: "127.0.0.1"
  },
  os: {
    name: "Windows",
    version: "NT 10.0",
    versionName: "10"
  },
  platform: {
    type: "desktop",
    vendor: "",
    model: "",
    pwa: false
  },
  engine: {
    name: "Gecko",
    version: "20100101"
  }
}
```

### Filter

You could want to filter some particular browsers to provide any special support for them or make any workarounds. It could look like this:

```js
const isValidBrowser = this.$device.filter({
  // declare browsers per OS
  windows: {
    'internet explorer': '>10'
  },
  macos: {
    safari: '>10.1'
  },

  // per platform (mobile, desktop or tablet)
  mobile: {
    safari: '>=9',
    'android browser': '>3.10'
  },

  // or in general
  chrome: '~20.1.1432',
  firefox: '>31',
  opera: '>=22',

  // also supports equality operator
  chrome: '=20.1.1432', // will match particular build only

  // and loose-equality operator
  chrome: '~20', // will match any 20.* sub-version
  chrome: '~20.1' // will match any 20.1.* sub-version (20.1.19 as well as 20.1.12.42-alpha.1)
});
```

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `yarn run dev` or `npm run dev`
- Point your browser to `http://localhost:3000`

## License

[MIT License](./LICENSE)
