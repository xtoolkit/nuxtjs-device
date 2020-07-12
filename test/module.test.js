const { Nuxt, Builder } = require('nuxt')
const request = require('request-promise-native')

const config = require('./fixture/nuxt.config')

const url = (path) => `http://localhost:3000${path}`
const get = (path) =>
  request({
    uri: url(path),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0',
    },
  })

describe('basic', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Detect Firefox')
  })
})
