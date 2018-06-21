const path = require('path')
const fs = require('fs-extra')
const AsyncCache = require('async-cache')
const pify = require('pify')
const TR = require('turbo-rss')

const defaults = {
  path: '/turbo-feed.xml',
  async create (feed) {},
  cacheTime: 1000 * 60 * 15
}

module.exports = async function feed () {
  if (typeof this.options.feed === 'function') {
    this.options.feed = await this.options.feed()
  }

  if (!Array.isArray(this.options.feed)) {
    this.options.feed = [this.options.feed]
  }

  const options = Object.assign([], this.options.feed).map(o => Object.assign({}, defaults, o))

  const feedCache = new AsyncCache({
    maxAge: options.cacheTime,
    load (feedIndex, callback) {
      createFeed(options[feedIndex], callback)
    }
  })

  feedCache.get = pify(feedCache.get)

  await options.forEach(async (feedOptions, index) => {
    this.nuxt.hook('generate:before', async () => {
      const xmlGeneratePath = path.resolve(this.options.srcDir, path.join('static', feedOptions.path))
      await fs.removeSync(xmlGeneratePath)
      await fs.outputFile(xmlGeneratePath, await feedCache.get(index))
    })

    this.addServerMiddleware({
      path: feedOptions.path,
      handler (req, res, next) {
        feedCache.get(index)
          .then(xml => {
            res.setHeader('Content-Type', 'application/xml')
            res.end(xml)
          })
          .catch(/* istanbul ignore next: Nuxt handling */ err => { next(err) })
      }
    })
  })
}

async function createFeed (feedOptions, callback) {
  const feed = new TR(feedOptions)
  await feedOptions.create.call(this, feed)
  return callback(null, feed.xml(), feedOptions.cacheTime)
}

module.exports.meta = require('../package.json')
