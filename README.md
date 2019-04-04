<a href="https://gitter.im/Reactlandia/Lobby" target="_blank">
  <img alt="Edit Redux-First Router Demo" src="http://cdn.reactlandia.com/chat-badge-reactlandia.png">
</a>


# extract-css-chunks-webpack-plugin

<p align="center">
  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/v/extract-css-chunks-webpack-plugin.svg" alt="Version" />
  </a>

  <a href="https://travis-ci.org/faceyspacey/extract-css-chunks-webpack-plugin">
    <img src="https://travis-ci.org/faceyspacey/extract-css-chunks-webpack-plugin.svg?branch=master" alt="Build Status" />
  </a>

  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/dt/extract-css-chunks-webpack-plugin.svg" alt="Downloads" />
  </a>

  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/dm/extract-css-chunks-webpack-plugin.svg" alt="License" />
  </a>
  
  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/l/extract-css-chunks-webpack-plugin.svg" alt="License" />
  </a>
</p>

<h2 align="center">🍾🍾🍾It's our absolute pleasure to announce Webpack 4 Support 🚀🚀🚀</h2>

> **HEADLINES (May 2018): Now Independently supports Webpack 4:** 
Yep that's right. The universal family is now fully Webpack 4. Thank you to all our users for your loyalty and patience! If you love Universal, then you are gonna fall head over heels when we bring out the main course! 

So... why did we rebuild `extract-css-chunks`? What does it offer? 

It's got all the goodness of `mini-css-extract-plugin` but with 2 gleaming, sought after benefits. 

Compared to the existing loaders, we are offering a single solution as opposed to needing to depend on multiple loaders to cater for different features:

## Perks
* **HMR:** It also has first-class support for **Hot Module Replacement** across ALL those css files/chunks!!!
* cacheable stylesheets 
* smallest total bytes sent compared to "render-path" css-in-js solutions that include your CSS definitions in JS
* Faster than the V2!
* Async loading
* No duplicate compilation (performance)
* Easier to use
* Specific to CSS
* SSR Friendly development build, focused on frontend DX
* Works seamlessly with the Universal family
* Works fantastically as a standalone style loader (You can use it for any webpack project! with no extra dependencies!)

Additionally, if you are already a user of the universal family -- we will be waving goodbye to the mandatory ```window.__CSS_CHUNKS__```.

The functionality is still available to you via chunk flushing, and it can come in super handy when needing to easily resolve style assets as urls that might need to be passed to a third party.

## Webpack 4 Standalone Installation:

If you are just looking for something that works like `mini-css-extract-plugin` but with HMR, then look no further.

NOTE: We have aligned out loader implementation to be the same as `mini-css-extract-plugin` 

**If you already use `mini-css-extract-plugin`, then you can just change the `require` statement - it's that easy**

```
yarn add --dev extract-css-chunks-webpack-plugin
```

*webpack.config.js:*
```js
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
           {
             loader:ExtractCssChunks.loader,
             options: {
               hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
               reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
             }
           },
           "css-loader"
         ]
      }
    ]
  },
  plugins: [
    new ExtractCssChunks(
        {
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "[name].css",
          chunkFilename: "[id].css",
          orderWarning: true, // Disable to remove warnings about conflicting order between imports
        }
    ),
  ]
}
```

*webpack.server.config.js*

The server needs to be handled differently, we still want one chunk. Luckily webpack 4 supports **LimitChunkCountPlugin**

```js
new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
})
```


### What about Webpack 3?
This is a breaking change. The entire loader has been fundamentally rewritten specifically for Webpack 4. Aiming to support our existing user base, allowing them to upgrade their infrastructure to support Webpack 4 based universally code-split server-side rendered react applications. 

There have been some challenges along the way since the release of webpack 4. Ultimately the only remaining hurdle is code split, async style loading. 

If you do need Webpack 3, make sure to stick with the latest `v2.x.x` release. `> v3.x.x` is only intended for users with Webpack 4




*Note: this is a companion package to:*
- [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) 
- [react-universal-component](https://github.com/faceyspacey/react-universal-component)
- [babel-plugin-universal-import](https://github.com/faceyspacey/babel-plugin-universal-import) ***or*** [babel-plugin-dual-import](https://github.com/faceyspacey/babel-plugin-dual-import)


## Recommended Installation For Universal
```
yarn add react-universal-component webpack-flush-chunks
yarn add --dev extract-css-chunks-webpack-plugin babel-plugin-universal-import
```

*.babelrc:*
```js
{
  "plugins": ["universal-import"]
}
```
The main thing is you need to cater to the new chunking system of webpack!
With **webpack.optimize.CommonsChunkPlugin** plugin no longer part of Webpack 4, we need another way to define the code-splitting. Luckily we have `optimization` configs built into webpack now

> There are more aggressive ways to code split, thanks to webpack 4. Check out the RUC Readme if you are looking for a more aggressive code split optimization configuration. These are just examples, you should be able to configure them as you see fit

- `splitChunks`: Adding this to your `dev-webpack` will help with HMR when changing file names (or moving the files) which are dynamically imported. If you dont add this to your dev-webpack you might get this error: `Runtime TypeError: Cannot read property 'call' of undefined at __webpack_require__`. Could be related to this webpack issue: https://github.com/webpack/webpack/issues/6094. Adding it to your `prod-webpack` could unfortunately increase your total file size about 15% (in my test project), this is because you are changing webpacks defualt `chunks: async` to `chunks: 'initial'`
- `runtimeChunk`: removed a hmr warning in chrome dev console, which got printed when starting the dev server. What it does and why it is needed together with `bootstrap` would be nice if someone else could make a PR for.
- `minimizer: { UglifyJSPlugin`: Override the default UglifyjsWebpackPlugin minimizer with custom settings. These settings are probably default by now. They didnt do anything to the bundle size in my test project. Install instructions: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/

*webpack.config.js:*
```js
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // or Terser plugin

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader:ExtractCssChunks.loader,
            options: {
              hot: true,
              reloadAll: true
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
      // FOR PRODUCTION
      minimizer: [
          new UglifyJsPlugin({
              uglifyOptions: {
                  output: {
                      comments: false,
                      ascii_only: true
                  },
                  compress: {
                      comparisons: false
                  }
              }
          })
      ],
      // END
      // NEEDED BOTH IN PROD AND DEV BUILDS
      runtimeChunk: {
          name: 'bootstrap'
      },
      splitChunks: {
          chunks: 'initial',
          cacheGroups: {
              vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendor'
              }
          }
      }
  },
  plugins: [
    new ExtractCssChunks({
      filename: '[name].css',
    }),
  ]
};
```

## Desired Output
Here's the sort of CSS you can expect to serve:

```
<head>
	<link rel='stylesheet' href='/static/main.css' />
	<link rel='stylesheet' href='/static/0.css' />
	<link rel='stylesheet' href='/static/7.css' />
</head> 

<body>
	<div id="react-root"></div>
	
	<script type='text/javascript' src='/static/vendor.js'></script>
	<script type='text/javascript' src='/static/0.js'></script>
	<script type='text/javascript' src='/static/7.js'></script>
	<script type='text/javascript' src='/static/main.js'></script>
</body>
```

If you need to resolve your stylesheets on the client side, for whatever reason. 

[webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) will scoop up the exact stylesheets to embed in your response. It will give you an object which can be embedded on page

Here's how you do it:


*src/components/App.js:*
```js
const UniversalComponent = universal(props => import(`./${props.page}`))

<UniversalComponent page='Foo' />
```

*server/render.js:*
```js
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'

const app = ReactDOMServer.renderToString(<App />)
const { js, styles, cssHash } = flushChunks(webpackStats, {
  chunkNames: flushChunkNames()
})

res.send(`
  <!doctype html>
  <html>
    <head>
      ${styles}
    </head>
    <body>
      <div id="root">${app}</div>
      <!-- not needed unless you want to access css chunks urls manually  -->
      ${cssHash}
      <!-- extract-css-chunks takes care of loading the css assets automatically -->
      ${js}
    </body>
  </html>
`)
```

***As for asynchronous calls to `import()` on user navigation,*** [babel-plugin-universal-import](https://github.com/faceyspacey/babel-plugin-universal-import) is required if you're using [react-universal-component](https://github.com/faceyspacey/react-universal-component). And if you aren't, you must use: [babel-plugin-dual-import](https://github.com/faceyspacey/babel-plugin-dual-import). 


These babel plugins request both your js + your css. *Very Nice!* This is the new feature of the 2.0. Read *Sokra's* (author of webpack) article on how [on how this is the future of CSS for webpack](https://medium.com/webpack/the-new-css-workflow-step-1-79583bd107d7). Use this and be in the future today.


## API 
You can pass the same options as `mini-css-extract` to `new ExtractCssChunks`, such as:

```javascript
new ExtractCssChunk({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
})
```

>Keep in mind, by default `[name].css` is used when `process.env.NODE_ENV === 'development'` and `[name].[contenthash].css` during production, so you can likely forget about having to pass anything.


### HMR Pitfall

The most common workflow when working with webpack is to write a "development" / "production" value in to the
'process.env.NODE_ENV' namespace, typically, using webpack's built-in "DefinePlugin" plugin. e.g:

```javascript
new webpack.DefinePlugin( {
     'process.env': {
        NODE_ENV: `"${config.devMode ? 'development' : 'production'}"`,
      },
} )
```
The value set by the aforementioned plugin will only be available in the runtime ( when webpack's javascript output is executed ).
In order for this plugin to work with hot module reloading, The npm script / gulp task / grunt task etc, should be invoked with the same environment variable as shown above.

For example, when running the build using some form of npm script:

```json
{
  "scripts": {
     "build": "cross-env NODE_ENV=production babel src -d dist --ignore 'src/**/*.test.js' --copy-files"
  }
}
```
[cross-env](https://www.npmjs.com/package/cross-env) is optional but recommended. 

### What about Glamorous, Styled Components, Styled-Jsx, Aphrodite, etc?

If you effectively use code-splitting, **Extract Css Chunks** can be a far better option than using emerging solutions like *Glamorous*, *Styled Components*, and slightly older tools like *Aphrodite*, *Glamor*, etc. We aren't fans of either rounds of tools because of several issues, but particularly because they all have a runtime overhead. Every time your React component is rendered with those, CSS is generated and updated within the DOM. On the server, you're going to also see unnecessary cycles for flushing the CSS along the critical render path.

The reason **Extract CSS Chunk** can be a better option is because **we also generate multiple sets of CSS based on what is actually "used",** ***but without the runtime overhead***. The difference is our definition of "used" is modules determined *statically* (which may not in fact be rendered) vs. what is in the "critical render path" (as is the case with the other tools). 

So yes, our CSS may be mildly larger and include unnecessary css, but our `no_css.js` bundles will be a lot smaller as they don't need to inject any styles. See, even though those solutions have the smallest possible CSS file size, their javascript bundles, **in order to continue to render your components styled properly on the client,** must contain the necessary CSS for all possibilities! Those solutions serve both your entire bundle's CSS (in your javascript) **and** the CSS flushed from the critical render path. 

On top of that, those are extra packages all with a huge number of issues in their Github repos corresponding to various limitations in the CSS they generate--something that is prevented when your definition for "CSS-in-JS" is simply importing CSS files compiled as normal by powerful proven CSS-specific processors.

Lastly, those solutions don't provide cacheable stylesheets. They do a lot of work--but they will **continue** doing it for you when you could have been done in one go long ago. Cloudflare is free--serve them through their CDN and you're winning. I love true javascript in css--don't get me wrong--but first I'd have to see they generate cacheable stylesheets. In my opinion, for now, it's best for environments that natively support it such as React Native.


### Next:

Now with that out of the way, for completeness let's compare what bytes of just the CSS are sent over the wire. The difference basically is minimal. Whereas solutions that flush from the critical render path will capture no more than the precise bits of CSS from the `if/else` branches followed, **Extract Css Chunks** is all about you effectively using code-splitting to insure, for example, you don't serve your Administration Panel's CSS in your public-facing site, etc. *In other words, it's all about avoiding serving large swaths of CSS from completely different sections of your app.* ***I.e. the biggest gains available to you.*** 

<details>
<summary>
    Read more on the topic ^^
</summary>

This is where the real problem lies--where the real amount of unnecessary CSS comes from. If you effectively code-split your app, you may end up with 10 chunks. Now you can serve just the corresponding CSS for that chunk. If you try to go even farther and remove the css not used in the render path, you're likely achieving somewhere between 1-20% of the gains you achieved by thorough code-splitting. In other words, code splitting fulfills the 80/20 rule and attains the simple sweetspot of 80% optimization you--*as a balanced, level-headed, non-neurotic and professional developer*--are looking to achieve.

*In short, by putting code splitting in appropriate places you have a lot of control over the CSS files that are created and can send a sensible* ***minimal*** *amount of associated bytes over the wire for the first request, perhaps even the smallest amount of all options.* 

It's our perspective that you have achieved 80-99% of the performance gains (i.e. the creation of small relevant css files) at this ***static stage***. Offloading this work to the runtime stage is ultimately nit-picking and results in diminishing returns. When you factor that your JS bundle has to contain that JS anyway, those solutions make less and less sense from the perspective of reducing bytes delivered in the initial request. 

There may be other reasons to use those tools (e.g. you don't like setting up webpack configs, or somehow you're really fond of pre-creating many `<div />` elements with their styles), but we prefer a simple standards-based way (without HoCs or specialized style components) to import styles just as you would in React Native. However to give the other tools credit, many of them likely started out with a different problem motivating them: avoiding webpack configs so you can include packages and their contained CSS without client apps being required to setup something like CSS loaders in Webpack. Having your CSS completely contained in true JS has its use cases, but at the application level--especially when you're already using something like Webpack--we fail to see its benefits. About all they share is a solution to avoiding **flashes of unstyled content** (FOUC), except one can save you a lot more bytes in what you send over the wire and save you from a continual runtime overhead where it's not needed. ***Honorable Mention:*** *StyleTron's concept of "atomic declaration-level deduplication" where it will make a class out of, say, `color: blue` so you don't need to send redundant styles certainly is a novel innovation, but again if the code still exists in your JS and you're building an application using Webpack (instead of a package), what's the point. In fact, it just makes editing the stylesheets in your browser developer tools more complicated. One benefit of critical render path solutions is the browser can spend less time matching the smaller number of styles to new DOM nodes as they appear, but then again it also has to spend the time injecting and parsing the new styles constantly, which is likely costlier.*

As an aside, so many apps share code between web and React Native--so the answer to the styles problem must be one that is identical for both. From that perspective importing a styles object **still** makes a lot of sense. **You're not missing out on the fundamental aspect of CSS-in-JSS:** ***isolated component-level styles and the ability to import them just like any other javascript code.*** Put them in other files, and use tools like `extract-css-chunks-webpack-plugin` and your pre-processors of choice that innately get styles right for the browser. As long as you're using **CSS Modules**, you're still at the cutting edge of CSS-in-JSS. Let's just say the other tools took one wrong turn and took it too far, when we already were at our destination. 
</details>


#### SUMMARY OF BENEFITS COMPARED TO "CRITICAL-RENDER-PATH" SOLUTIONS:

- no continual runtime overhead during `render` using HoCs that inject styles
- smaller JS bundles without CSS injection
- **You DO NOT need to clutter your component code with a specialized way of applying CSS (HoCs, styled elements)!** 
- The way you import module-based styles is exactly how you would import styles in React Native that exist in a separate file, which allows for extremely interchangeable code between React Native and regular React. Hurray! 
- pretty much already does everything covered by [@vjeux's 2014 css-in-js talk](https://speakerdeck.com/vjeux/react-css-in-js), besides dead code elimination. Dead code elimination is only solved for the other tools--as per the explanation above how the CSS is in the JS anyway--so much as Webpack and Uglify can remove **JS** that is not used. Either way, it's not a stretch to eventually add this feature to `extract-text-webpack-plugin` as well as this plugin. Hey, maybe it already has it??

## Emotion!

[Emotion](https://github.com/tkh44/emotion) is different. They allow for the extraction of static styles via their *extract mode*. We're very much looking forward to this being the perfect companion to the css chunks approach. 
<details>
<summary>
    Read more on the topic ^^
</summary>

Currently however *extract mode* does not support IE11. So that means it's a no go, but we have hopes that in the future they'll solve that problem.

The reason Emotion doesn't work in IE11+ is because they currently try to preserve any dynamic aspects of your CSS-in-JS by converting it CSS vars, which isn't supported in IE11. That was a very smart approach, but unfortunately not good enough. 

The vision we'd like to see for that package is where dynamic css stays inline, and where only static CSS is extracted into stylesheets, in which case CSS vars aren't needed. I've heard from them they have some "hidden flags" that allow for something close to this. When, and if, they take this feature all the way, look forward to us pushing it as our recommended approach. *Go Emotion!*
</details>

## Linaria

Linaria is another modern CSS-in-JSS library. It's focused around static styles, which may make it a perfect fit for usage with this plugin. Check it out:

https://github.com/callstack/linaria

## What if I don't use SSR and use html-webpack-plugin?

For that case you can use [css-chunks-html-webpack-plugin](https://github.com/teamable-software/css-chunks-html-webpack-plugin) which will extract CSS chunks paths into your HTML file.

## Conclusion:
**We love CSS modules; no less, no more.**

**Long live the dream of Code Splitting Everywhere!**


## Contributing
We use [commitizen](https://github.com/commitizen/cz-cli), so run `npm run cm` to make commits. A command-line form will appear, requiring you answer a few questions to automatically produce a nicely formatted commit. Releases, semantic version numbers, tags and changelogs will automatically be generated based on these commits thanks to [semantic-release](https://github.com/semantic-release/semantic-release). Be good.

## More from FaceySpacey in Reactlandia
- [redux-first-router](https://github.com/faceyspacey/redux-first-router). It's made to work perfectly with *Universal*. Together they comprise our *"frameworkless"* Redux-based approach to what Next.js does (splitting, SSR, prefetching, and routing). *People are lovin it by the way* 😎
