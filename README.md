If you like our work, check out our Redux-based router <a href="https://github.com/faceyspacey/redux-first-router" target="_blank">redux-first-router</a> or its sucessor which, <a href="https://github.com/respond-framework/rudy" target="_blank">Rudy<a>

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
> Yep that's right. The universal family is now fully Webpack 4. Thank you to all our users for your loyalty and patience! If you love Universal, then you are gonna fall head over heels when we bring out the main course!

So... why did we rebuild `extract-css-chunks-webpack-plugin`? What does it offer?

It's got all the goodness of `mini-css-extract-plugin` but with 2 gleaming, sought after benefits.

Compared to the existing loaders, we are offering a single solution as opposed to needing to depend on multiple loaders to cater for different features:

## Perks

- **HMR:** It also has first-class support for **Hot Module Replacement** across ALL those css files/chunks!!!
- cacheable stylesheets
- smallest total bytes sent compared to "render-path" css-in-js solutions that include your CSS definitions in JS
- Faster than the V2!
- Async loading
- No duplicate compilation (performance)
- Easier to use
- Specific to CSS
- SSR Friendly development build, focused on frontend DX
- Works seamlessly with the Universal family
- Works fantastically as a standalone style loader (You can use it for any webpack project! with no extra dependencies!)
- Async styles do not render block webkit browsers, if you use the `insert` option

Additionally, if you are already a user of the universal family -- we will be waving goodbye to the mandatory `window.__CSS_CHUNKS__`.

The functionality is still available to you via chunk flushing, and it can come in super handy when needing to easily resolve style assets as urls that might need to be passed to a third party.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [new ExtractCssChunks()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

## Options

### `publicPath`

Type: `String|Function`
Default: the `publicPath` in `webpackOptions.output`

Specifies a custom public path for the target file(s).

#### `String`

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              publicPath: '/public/path/to/',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

### `esModule`

Type: `Boolean`
Default: `false`

By default, `extract-css-chunks-webpack-plugin` generates JS modules that use the CommonJS modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a ES module syntax using:

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [new ExtractCssChunks()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

## Examples

### Minimal example

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

### The `publicPath` option as function

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

### Advanced configuration example

This plugin should be used only on `production` builds without `style-loader` in the loaders chain, especially if you want to have HMR in `development`.

Here is an example to have both HMR in `development` and your styles extracted in a file for `production` builds.

(Loaders options left out for clarity, adapt accordingly to your needs.)

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

### Hot Module Reloading (HMR)

The `extract-css-chunks-webpack-plugin` supports hot reloading of actual css files in development.
Some options are provided to enable HMR of both standard stylesheets and locally scoped CSS or CSS modules.
Below is an example configuration of `extract-css-chunks` for HMR use with CSS modules.

While we attempt to hmr css-modules. It is not easy to perform when code-splitting with custom chunk names.
`reloadAll` is an option that should only be enabled if HMR isn't working correctly.
The core challenge with css-modules is that when code-split, the chunk ids can and do end up different compared to the filename.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

### Minimizing For Production

To minify the output, use a plugin like [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin).
Setting `optimization.minimizer` overrides the defaults provided by webpack, so make sure to also specify a JS minimizer:

**webpack.config.js**

```js
const TerserJSPlugin = require('terser-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new ExtractCssChunks({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### Using preloaded or inlined CSS

The runtime code detects already added CSS via `<link>` or `<style>` tag.
This can be useful when injecting CSS on server-side for Server-Side-Rendering.
The `href` of the `<link>` tag has to match the URL that will be used for loading the CSS chunk.
The `data-href` attribute can be used for `<link>` and `<style>` too.
When inlining CSS `data-href` must be used.

### Extracting all CSS in a single file

Similar to what [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) does, the CSS can be extracted in one CSS file using `optimization.splitChunks.cacheGroups`.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new ExtractCssChunks({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### Extracting CSS based on entry

You may also extract the CSS based on the webpack entry name.
This is especially useful if you import routes dynamically but want to keep your CSS bundled according to entry.
This also prevents the CSS duplication issue one had with the ExtractTextPlugin.

```js
const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  entry: {
    foo: path.resolve(__dirname, 'src/foo'),
    bar: path.resolve(__dirname, 'src/bar'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        fooStyles: {
          name: 'foo',
          test: (m, c, entry = 'foo') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        barStyles: {
          name: 'bar',
          test: (m, c, entry = 'bar') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new ExtractCssChunks({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### Module Filename Option

With the `moduleFilename` option you can use chunk data to customize the filename. This is particularly useful when dealing with multiple entry points and wanting to get more control out of the filename for a given entry point/chunk. In the example below, we'll use `moduleFilename` to output the generated css into a different directory.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      moduleFilename: ({ name }) => `${name.replace('/js/', '/css/')}.css`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### Long Term Caching

For long term caching use `filename: "[contenthash].css"`. Optionally add `[name]`.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### Remove Order Warnings

For projects where css ordering has been mitigated through consistent use of scoping or naming conventions, the css order warnings can be disabled by setting the ignoreOrder flag to true for the plugin.

**webpack.config.js**

```js
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  plugins: [
    new ExtractCssChunks({
      ignoreOrder: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ExtractCssChunks.loader, 'css-loader'],
      },
    ],
  },
};
```

### insert

Type: `String|Function`
Default: `head`

By default, the `extract-css-chunks-plugin` appends styles (`<link>` elements) to `document.head` of the current `window`.

However in some circumstances it might be necessary to have finer control over the append target or even delay `link` elements instertion. For example this is the case when you asynchronously load styles for an application that runs inside of an iframe. In such cases `insert` can be configured to be a function or a custom selector.

If you target an [iframe](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement) make sure that the parent document has sufficient access rights to reach into the frame document and append elements to it.

#### `insert` as a string

Allows to configure a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) that will be used to find the element where to append the styles (`link` elements).

```js
new ExtractCssChunksPlugin({
  insert: '#my-container',
});
```

A new `<link>` element will be appended to the `#my-container` element.

#### `insert` as a function

Allows to override default behavior and insert styles at any position.

> ⚠ Do not forget that this code will run in the browser alongside your application. Since not all browsers support latest ECMA features like `let`, `const`, `arrow function expression` and etc we recommend you to use only ECMA 5 features and syntax.

> ⚠ The `insert` function is serialized to string and passed to the plugin. This means that it won't have access to the scope of the webpack configuration module.

```js
new ExtractCssChunksPlugin({
  insert: function insert(linkTag) {
    const reference = document.querySelector('#some-element');
    if (reference) {
      reference.parentNode.insertBefore(linkTag, reference);
    }
  },
});
```

A new `<link>` element will be inserted before the element with id `some-element`.

### Media Query Plugin

If you'd like to extract the media queries from the extracted CSS (so mobile users don't need to load desktop or tablet specific CSS anymore) you should use one of the following plugins:

- [Media Query Plugin](https://github.com/SassNinja/media-query-plugin)
- [Media Query Splitting Plugin](https://github.com/mike-diamond/media-query-splitting-plugin)
