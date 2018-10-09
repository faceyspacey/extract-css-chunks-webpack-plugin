const Self = require('../../../');

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          () => ({ loader: 'css-loader' }),
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
      hot: true,
    }),
  ],
};
