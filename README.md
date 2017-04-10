[![npm][npm]][npm-url]
[![chat][chat]][chat-url]

# Extract CSS Chunk

Like the Extract Text Webpack Plugin, but creates multiple css files (one per chunk). Then, as part of server side rendering, you can deliver just the css chunks needed by the current request. 

In addition, for each javascript chunk created  another js chunk is created with the styles injected via style-loader
so that when the client asynchronously loads more chunks the styles will be available as well. This is as opposed to to the chunks you 
initially serve embedded in the page, which are post-fixed with `no_css.js`, which do not inject styles since it's expected that
the corresponding extracted CSS files are embedded in the page as well. This obviously serves the purpose of reducing the size of your initially
served javascript chunks. As much as possible has been thought of to make this a complete solution.

BONUS: It also has first-class support for Hot Module Replacement across those css files/chunks. 

NOTE: most the code comes from the original Extract Text Webpack Plugin--the goal is to merge this functionality back into that package at some point. That might be a while. Until then I'd feel totally comfortable just using this package. It's meant specifically for use with *React Loadable*. For complete usage, see the [React Loadable Example](https://github.com/thejameskyle/react-loadable-example).

## Install
```bash
yarn add --dev extract-css-chunk
```

## Usage
```js
const ExtractCssChunk = require("extract-css-chunk")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractCssChunk.extract({
          use: 'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]',
        })
      }
    ]
  },
  plugins: [
    new ExtractCssChunk,
  ]
}
```


## Info

It moves all the `require("style.css")`s in entry chunks ***AND DYNAMIC CODE SPLIT CHUNKS*** into a separate ***multiple*** CSS files. So your styles are no longer inlined into the JS bundle, but separate in CSS bundle files (e.g named entry points: `main.12345.css` and dynamic split chunks: `0.123456.css`, `1.123456.css`, etc).

If you effectively use code-splitting this can be a far better option than using emerging solutions like *StyleStron*, *StyledComponents*,and slightly older tools like *Aphrodite*, *Glamor*, etc. We don't like either rounds of tools because they all have a runtime overhead. Every time your React component is rendered with those, CSS is generated and updated within the DOM. The reason *Extract CSS Chunk* can be a better option is because *we also generate multiple sets of CSS* based on what is actually "used", but without the runtime overhead. The difference is our definition of "used" is modules determined statically (which may not in fact be rendered) vs. what is actually rendered (as is the case with the other tools). 

So yes, our CSS files may be mildly larger and include unnecessary css, but it's CSS that is likely to be used, i.e. if an "if/else" statement reaches another branch, *but not CSS from a different section of your app.*

In short, by putting code splitting appropriate places you have a lot of control over the css files that are created. **It's our perspective that you have achieved 80-99% of the performance gains (i.e. the creation of small relevant css files) at this static stage. Offloading this work to the runtime stage is ultimately nit-picking and results in diminishing returns.** 

ADDITIONAL BENEFIT: **This also means you DO NOT need to clutter your component code with a specialized way of applying CSS!** A final cherry on top is that the way you import module-based styles is exactly how you would import styles in React Native that exist in a separate file, which allows for extremely interchangeable code between React Native and regular React. Hurray! 

**We love CSS modules; no less, no more.**

## NOTE

The file name structure is currently hard-coded to be `[name].[contenthash].css`. It was first created to be used with *React Loadable* which will discover your CSS files for you (from webpack stats) no matter what you name them--so it's not something you need to worry about. If you want to fix that and therefore allow for a user-specified `filename` like in the original *Extract Text Plugin*, feel free to make a PR. The current filename structure is required for HMR so that new files are created on each change--so that is the problem you're trying to solve. For whatever reason, if the file name is the same (i.e. doesn't contain a hash) the original file is not updated. There are some notes in the code. Check the `hotModuleReplacement.js` file.


[npm]: https://img.shields.io/npm/v/extract-css-chunk.svg
[npm-url]: https://npmjs.com/package/extract-css-chunk

[tests]: http://img.shields.io/travis/faceyspacey/extract-css-chunk.svg
[tests-url]: https://travis-ci.org/faceyspacey/extract-css-chunk

[chat]: https://badges.gitter.im/extract-css-chunk.svg
[chat-url]: https://gitter.im/extract-css-chunk
