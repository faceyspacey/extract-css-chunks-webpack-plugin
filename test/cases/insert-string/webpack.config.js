const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const Self = require('../../');

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
    path: path.resolve(__dirname, 'dist'),
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
      chunkFilename: '[contenthash].css',
      insert: 'body',
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'test/cases/insert-string/index.html'),
        to: path.resolve(__dirname, 'test/cases/insert-string/dist'),
      },
    ]),
  ],
  devServer: {
    contentBase: __dirname,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
