<p align="center">
  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/v/extract-css-chunks-webpack-plugin.svg" alt="Version" />
  </a>

  <a href="https://travis-ci.org/faceyspacey/extract-css-chunks-webpack-plugin">
    <img src="https://travis-ci.org/faceyspacey/extract-css-chunks-webpack-plugin.svg?branch=master" alt="Build Status" />
  </a>

  <a href="https://greenkeeper.io">
    <img src="https://badges.greenkeeper.io/faceyspacey/extract-css-chunks-webpack-plugin.svg" alt="Green Keeper" />
  </a>

  <a href="https://www.npmjs.com/package/extract-css-chunks-webpack-plugin">
    <img src="https://img.shields.io/npm/dt/extract-css-chunks-webpack-plugin.svg" alt="Downloads" />
  </a>

  <a href="https://gitter.im/extract-css-chunks">
    <img src="https://img.shields.io/gitter/room/nwjs/nw.js.svg" alt="Gitter Chat" />
  </a>
</p>

# extract-css-chunks-webpack-plugin

Like `extract-text-webpack-plugin`, but creates multiple css files (one per chunk). Then, as part of server side rendering, you can deliver just the css chunks needed by the current request. The result is the most minimal CSS initially served compared to emerging JS-in-CSS solutions.

*Note: this is a companion package to:*
- [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) 
- [react-loadable](https://github.com/thejameskyle/react-loadable)

For a complete usage example, see the [Flush Chunks Boilerplate](https://github.com/faceyspacey/flush-chunks-boilerplate).

Here's the sort of CSS you can expect to serve:

```
<head>
	<link rel='stylesheet' href='/static/0.css' />
	<link rel='stylesheet' href='/static/main.css' />
</head> 

<body>
	<div id="react-root"></div>
	
	<script type='text/javascript' src='/static/vendor.js'></script>
	<script type='text/javascript' src='/static/0.no_css.js'></script>
	<script type='text/javascript' src='/static/main.no_css.js'></script>
</body>
```

If you use [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks), it will scoop up the exact stylesheets to embed in your response string for you.


## Perks:
- **HMR:** It also has first-class support for **Hot Module Replacement** across ALL those css files/chunks!!!

- **2 VERSIONS OF YOUR JS CHUNKS:** In addition to generating CSS chunks, this plugin in fact creates 2 javascript chunks instead of 1. It leaves untouched your typical chunk that injects styles via `style-loader` and creates another chunk named `name.no_css.js`, which has all CSS removed, thereby greatly reducing its file size. This allows for future asynchronously-loaded bundles (which will be loaded *without* a css file) to also have their corresponding styles, ***while reducing the size of your initially served javascript chunks as much as possible*** 🤓



## Installation
```
yarn add --dev extract-css-chunks-webpack-plugin
```


## Usage
```js
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: 'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]',
        })
      }
    ]
  },
  plugins: [
    new ExtractCssChunks,
  ]
}
```

## API 
You can pass the same options as `extract-text-webpack-plugin` to `new ExtractCssChunks`, such as:

```javascript
new ExtractCssChunk({
	filename: '[name].[contenthash].css'
})
```

Keep in mind we've added sensible defaults, specifically: `[name].css` is used when `process.env.NODE_ENV === 'deveopment'` and `[name].[contenthash].css` during production, so you can likely forget about having to pass anything.

The 2 exceptions are: `allChunks` will no longer do anything, and `fallback` will no longer do anything when passed to to `extract`. Basically just worry about passing your `css-loader` string and `localIdentName` 🤓



## How It Works

Just like your JS, it moves all the the required CSS into corresponding css chunk files. So entry chunks might be named: `main.12345.css` and dynamic split chunks would be named: `0.123456.css`, `1.123456.css`, etc. You will however now have 2 files for each javascript chunk: `0.no_css.js` and `0.js`. The former is what you should serve in the initial request (and what [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) in conjunction with [react-loadable](https://github.com/thejameskyle/react-loadable) will automatically serve). The latter, *which DOES contain css injection via style-loader*, is what will asyncronously be loaded in future async requests. This solves the fact that they otherwise would be missing CSS, since the webpack async loading mechanism isn't built to serve both a JS and CSS file. In total, 3 files are created for each named entry chunk and 3 files for each dynamically split chunk, e.g: 

**entry chunk:**
- `main.js`
- `main.no.js`
- `main.css`

**dynamic chunks**:

*chunk 0:*
- `0.js`
- `0.no_css.js`
- `0.css`

*chunk 1:*
- `1.js`
- `1.no_css.js`
- `1.css`

*chunk 2:*
- `2.js`
- `2.no_css.js`
- `2.css`

As part of server-side rendering, you obviously should embed within the page the js files with the `no_css.js` extension. The `.js` files will be loaded by default when Webpack asyncronously requests them, *and you won't have to worry about embedding them in any response strings.*


## What about Aphrodite, Glamor, StyleTron, Styled-Components, Styled-Jsx, etc?

If you effectively use code-splitting, **Exract Css Chunks** can be a far better option than using emerging solutions like *StyleTron*, *StyledComponents*, and slightly older tools like *Aphrodite*, *Glamor*, etc. We aren't fans of either rounds of tools because of several issues, but particularly because they all have a runtime overhead. Every time your React component is rendered with those, CSS is generated and updated within the DOM. On the server, you're going to also see unnecessary cycles for flushing the CSS along the critical render path. *Next.js's* `styled-jsx`, by the way, doesn't even work on the server--*not so good when it comes to flash of unstyled content (FOUC).*

The reason *Extract CSS Chunk* can be a better option is because *we also generate multiple sets of CSS based on what is actually "used",* ***but without the runtime overhead***. The difference is our definition of "used" is modules determined *statically* (which may not in fact be rendered) vs. what is in the "critical render path" (as is the case with the other tools). 

So yes, our CSS may be mildly larger and include unnecessary css, but our `no_css.js` bundles will be a lot smaller as they don't need to inject any styles. See, even though those solutions have the smallest possible CSS file size, their javascript bundles, *in order to continue to render your components styled properly on the client,* must contain the necessary CSS for all posibilities! Those solutions serve both your entire bundle's CSS (in your javascript) *and* the CSS flushed from the critical render path. 

On top of that, those are extra packages all with a huge number of issues in their Github repos corresponding to various limitations in the CSS they generate--something that is prevented when your definition for "CSS-in-JS" is simply importing CSS files compiled as normal by powerful proven CSS-specific processors.

Now with that out of the way, for completeness let's compare what bytes of just the CSS are sent over the wire. The difference basically is minimal. Whereas solutions that flush from the critical render path will capture no more than the precise bits of CSS from the `if/else` branches followed, **Extract Css Chunks** is all about you effectively using code-splitting to insure, for example, you don't serve your Administration Panel's CSS in your public-facing site, etc. *In other words, it's all about avoiding serving large swaths of CSS from completely different sections of your app.* ***I.e. the biggest gains available to you.*** 

This is where the real problem lies--where the real amount of unnecessary CSS comes from. If you effectively code-split your app, you may end up with 10 chunks. Now you can serve just the corresonding CSS for that chunk. If you try to go even farther and remove the css not used in the render path, you're likely acheiving somewhere between 1-20% of the gains you achieved by thorough code-splitting. In other words, code splitting fulfills the 80/20 rule and attains the simple sweetspot of 80% optimization you--*as a balanced, level-headed, non-neurotic and professional developer*--are looking to achieve.

*In short, by putting code splitting in appropriate places you have a lot of control over the CSS files that are created and can send a sensible* ***minimal*** *amount of associated bytes over the wire for the first request, perhaps even the smallest amount of all options.* 

It's our perspective that you have achieved 80-99% of the performance gains (i.e. the creation of small relevant css files) at this ***static stage***. Offloading this work to the runtime stage is ultimately nit-picking and results in diminishing returns. When you factor that your JS bundle has to contain that JS anyway, those solutions make less and less sense from the perspective of reducing bytes delivered in the initial request. 

There may be other reasons to use those tools (e.g. you don't like setting up webpack configs, or somehow you're really fond of pre-creating many `<div />` elements with their styles), but we prefer a simple standards-based way (without HoCs or specialized style components) to import styles just as you would in React Native. However to give the other tools credit, many of them likely started out with a different problem motivating them: avoiding webpack configs so you can include packages and their contained CSS without client apps being required to setup something like CSS loaders in Webpack. Having your CSS completely contained in true JS has its use cases, but at the application level--especially when you're already using something like Webpack--we fail to see its benefits. About all they share is a solution to avoiding *flashes of unstyled content* (FOUC), except one can save you a lot more bytes in what you send over the wire and save you from a continual runtime overhead where it's not needed. ***Honorable Mention:*** *StyleTron's concept of "atomic declaration-level deduplication" where it will make a class out of, say, `color: blue` so you don't need to send redundant styles certainly is a novel innovation, but again if the code still exists in your JS and you're building an application using Webpack (instead of a package), what's the point. In fact, it just makes editing the stylesheets in your browser developer tools more complicated. One benefit of critical render path solutions is the browser can spend less time matching the smaller number of styles to new DOM nodes as they appear, but then again it also has to spend the time injecting and parsing the new styles constantly, which is likely costlier.*

As an aside, so many apps share code between web and React Native--so the answer to the styles problem must be one that is identical for both. From that perspective importing a styles object *still* makes a lot of sense. **You're not missing out on the fundamental aspect of CSS-in-JSS:** ***isolated component-level styles and the ability to import them just like any other javascript code.*** Put them in other files, and use tools like `extract-css-chunks-webpack-plugin` and your pre-processors of choice that innately get styles right for the browser. As long as you're using *CSS Modules*, you're still at the cutting edge of CSS-in-JSS. Let's just say the other tools took one wrong turn and took it too far, when we already were at our destination.



**SUMMARY OF BENEFITS COMPARED TO "CRITICAL-RENDER-PATH" SOLUTIONS:** 

- no continual runtime overhead during `render` using HoCs that inject styles
- smaller JS bundles without CSS injection
- **You DO NOT need to clutter your component code with a specialized way of applying CSS (HoCs, styled elements)!** 
- The way you import module-based styles is exactly how you would import styles in React Native that exist in a separate file, which allows for extremely interchangeable code between React Native and regular React. Hurray! 
- pretty much already does everything covered by [@vjeux's 2014 css-in-js talk](https://speakerdeck.com/vjeux/react-css-in-js), besides dead code elimination. Dead code elimination is only solved for the other tools--as per the explanation above how the CSS is in the JS anyway--so much as Webpack and Uglify can remove **JS** that is not used. Either way, it's not a stretch to eventually add this feature to `extract-text-webpack-plugin` as well as this plugin. Hey, maybe it already has it??


## Conclusion:
**We love CSS modules; no less, no more.**

**Long live the dream of Code Splitting Everywhere!**


## Notes on extract-text-webpack-plugin

Most the code comes from the original Extract Text Webpack Plugin--the goal is to merge this functionality back into that package at some point, though that process is not looking good. So that might be a while. Until then I'd feel totally comfortable just using this package. Though it took a while to make (and figure out how the original package worked), very little code has changed, and it won't be hard to keep in sync with upstream changes. 


## Contributing
We use [commitizen](https://github.com/commitizen/cz-cli), so run `npm run commit` to make commits. A command-line form will appear, requiring you answer a few questions to automatically produce a nicely formatted commit. Releases, semantic version numbers, tags and changelogs will automatically be generated based on these commits thanks to [semantic-release](https://github.com/semantic-release/semantic-release).

