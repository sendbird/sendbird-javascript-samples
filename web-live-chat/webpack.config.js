'use strict';
const path = require('path');

module.exports = {
  entry: {
    liveChat: ['babel-polyfill', './src/js/chat.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].SendBird.js',
    publicPath: 'dist'
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    publicPath: '/dist/',
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        // SCSS
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]'
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        // ESLint
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|SendBird.min.js)/,
        loader: 'eslint-loader',
        options: {
          failOnError: true
        }
      },
      {
        // ES6
        test: /\.js($|\?)/i,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  }
};
