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

```js
{
  modules: [
    // Simple usage
    'yandex-turbo-feed-module',

    // With options
    ['yandex-turbo-feed-module', { /* module options */ }],
 ]
}
```

- Configure it as you need

## Configuration

So.. how to get these feeds working now?

### Configuration object overview

```js
{
 //...
 'yandex-turbo-feed-module': [
   // A default feed configuration object
   {
     path: '/turbo-feed.xml', // The route to your feed.
     async create (feed) {}, // The create function (see below)
     cacheTime: 1000 * 60 * 15, // How long should the feed be cached
   }
 ],
 //...
}
```

### Feed create function

Let's take a closer look on the `create` function. This is the API that 
actually modifies your upcoming feed.

A simple create function could look like this:

```js
create = async feed => {
  feed.options = {
    title: 'title',
    description: 'description',
    link: 'http://example.com'
  }
  
  const posts = await axios.get('https://blog.lichter.io/posts/').data
  posts.forEach(post => { 
    feed.item({
        title: post.title,
        id: post.url,
        link: post.url,
        description: post.description,
        content: post.content
  })
}
```

Feed creation is based on the [turbo-rss](https://github.com/LightAir/turbo-rss) package.
Please use it as reference and further documentation for modifying the `feed` object
that is passed to the `create` function.

Using the `create` function gives you almost unlimited possibilities to customize your feed!

### Using a feed factory function

There is one more thing. Imagine you want to add a feed per blog category, but you don't want
to add every category by hand.

You can use a `factory function` to solve that problem. Instead of a hardcoded array, you can setup
a function that will be called up on feed generation. The function **must** return an array with all
feeds you want to generate.

```js
{
 'yandex-turbo-feed-module': async () => {
     const posts = (await axios.get('https://my-url.com/posts')).data
     const tags = (await axios.get('https://my-url.com/tags')).data
     
     return tags.map(t => {
       const relevantPosts = posts.filter(/*filter posts somehow*/)
 
       return {
         path: `/${t.slug}.xml`, // The route to your feed.
         async create (feed) {
           feed.options = {
             title: `${t.name} - My blog`,
             description: `All posts related to ${t.name} of my blog`,
           }
 
           relevantPosts.forEach(post => {
             feed.addItem({
               title: post.title,
               id: post.id,
               link: `https://blog.lichter.io/posts/${post.slug}`,
               description: post.excerpt,
               content: post.text
             })
           })
         },
         cacheTime: 1000 * 60 * 15,
       }
     })
   },
}
```


## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Samolovov Vladislav
