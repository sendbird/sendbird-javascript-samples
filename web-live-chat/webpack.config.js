'use strict';
const path = require('path');
const webpack = require('webpack');

const PRODUCTION = 'production';

module.exports = () => {
  const config = {
    entry: {
      liveChat: './src/js/chat.js'
    },
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].SendBird.js',
      publicPath: 'build'
    },
    devtool: 'cheap-eval-source-map',
    devServer: {
      publicPath: '/build/',
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
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                module: true,
                minimize: process.env.WEBPACK_MODE === PRODUCTION,
                // sourceMap: true,
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
          exclude: /(node_modules|bower_components|SendBird.min.js)/,
          loader: 'eslint-loader',
          options: { failOnError: true }
        },
        {
          // ES6
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    }
  };

  return config;
};
