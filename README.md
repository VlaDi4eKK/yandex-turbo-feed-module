# yandex-turbo-feed-module
[![npm (scoped with tag)](https://img.shields.io/npm/v/yandex-turbo-feed-module/latest.svg?style=flat-square)](https://npmjs.com/package/yandex-turbo-feed-module)
[![npm](https://img.shields.io/npm/dt/yandex-turbo-feed-module.svg?style=flat-square)](https://npmjs.com/package/yandex-turbo-feed-module)
[![CircleCI](https://img.shields.io/circleci/project/github/VlaDi4eKK/yandex-turbo-feed-module.svg?style=flat-square)](https://circleci.com/gh/VlaDi4eKK/yandex-turbo-feed-module)
[![Codecov](https://img.shields.io/codecov/c/github/VlaDi4eKK/yandex-turbo-feed-module.svg?style=flat-square)](https://codecov.io/gh/VlaDi4eKK/yandex-turbo-feed-module)
[![Dependencies](https://david-dm.org/VlaDi4eKK/yandex-turbo-feed-module/status.svg?style=flat-square)](https://david-dm.org/VlaDi4eKK/yandex-turbo-feed-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> 

[📖 **Release Notes**](./CHANGELOG.md)

## Features

* Generating Yandex Turbo pages!
* Completely customizable!

## Setup

- Add `yandex-turbo-feed-module` dependency using yarn or npm to your project
- Add `yandex-turbo-feed-module` to `modules` section of `nuxt.config.js`
- Add `yandexTurboFeed` method to `nuxt.config.js`

```js
{
  modules: [
    //...   
    'yandex-turbo-feed-module',
    //...
 ]
}
```

- Configure it as you need

## Configuration

So.. how to get these feeds working now?

### Configuration object overview

```js
{
  modules: [ ... ],
  //...
  yandexTurboFeed: { // A default feed configuration object
    path: '/turbo-feed.xml', // The route to your feed.
    link: 'http://example.com/',
    cacheTime: 1000 * 60 * 15, // How long should the feed be cached
    title: 'Title turbo feed',
    description: 'Description turbo feed',
    async create (feed) { ... } // The create function (see below)
  },
  //...
}
```

### Feed create function

Let's take a closer look on the `create` function. This is the API that 
actually modifies your upcoming feed.

A simple create function could look like this:

```js
//...
yandexTurboFeed: {
  //...
  async create (feed) {
    const articles = await getArticles(); // Your method for obtaining a list of articles
  
    articles.forEach(article => {
      feed.item({
        title: article.title,
        id: article.id,
        link: `http://example.com/articles/${article.slug}/`,
        description: article.description,
        date: new Date(article.datetime_publications),
        content: article.content
      })
    });
  }
}
```

### getArticle example function

```js
const axios = require('axios');

async function getArticles() {
  return await axios.get('http://example.com/articles/').then(res => { return res.data });
}
```

Feed creation is based on the [turbo-rss](https://github.com/LightAir/turbo-rss) package.
Please use it as reference and further documentation for modifying the `feed` object
that is passed to the `create` function.


## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Samolovov Vladislav
