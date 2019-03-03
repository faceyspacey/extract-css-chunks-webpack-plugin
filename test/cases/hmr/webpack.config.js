const Self = require('../../../');

module.exports = {
  entry: './index.css',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Self.loader,
            options: {
              hmr: true,
              modules: true,
              reloadAll: true
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new Self({
      filename: '[name].css',
    }),
  ],
};
