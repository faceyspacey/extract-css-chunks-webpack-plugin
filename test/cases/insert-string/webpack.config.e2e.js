const path = require('path');

const Self = require('../../../');

const ENABLE_HMR =
  typeof process.env.ENABLE_HMR !== 'undefined'
    ? Boolean(process.env.ENABLE_HMR)
    : false;

const ENABLE_ES_MODULE =
  typeof process.env.ES_MODULE !== 'undefined'
    ? Boolean(process.env.ES_MODULE)
    : false;

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'expected'),
    chunkFilename: '[contenthash].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/\.module\.css$/i],
        use: [
          {
            loader: Self.loader,
            options: {
              hmr: ENABLE_HMR,
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: Self.loader,
            options: {
              hmr: ENABLE_HMR,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              esModule: ENABLE_ES_MODULE,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      chunkFilename: '[id].css',
      insert: '(linkTag) => { document.head.appendChild(linkTag) }',
    }),
  ],
  devServer: {
    contentBase: __dirname,
    port: 5000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
