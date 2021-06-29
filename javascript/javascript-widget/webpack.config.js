var path = require('path');

module.exports = {
  entry: {
    widget: ['babel-polyfill', './src/js/widget.js']
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].SendBird.js',
    publicPath: "dist"
  },
  devtool: "cheap-eval-source-map",
  devServer: {
    publicPath: '/dist/',
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { // SCSS
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      { // ESLint
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|SendBird.min.js)/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true
            }
          }
        ]
      },
      { // ES6
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
};
