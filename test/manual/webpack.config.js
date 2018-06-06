const Self = require('../../');
const webpack = require('webpack');

const config = {
  mode: 'development',
  output: {
    chunkFilename: '[contenthash].js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,

        use: [
          {
            loader: Self.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      chunkFilename: '[contenthash].css',
      hot: false
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: __dirname,
    hot: true,
  },
};

module.exports = config;
