'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = 'production';

module.exports = () => {
  const config = {
    entry: {
      index: ['./src/js/index.js', './src/scss/index.scss'],
      main: ['./src/js/main.js', './src/scss/main.scss']
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'sample.[name].js',
      library: '[name]',
      libraryExport: 'default',
      libraryTarget: 'umd',
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
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
          })
        },
        {
          // ESLint
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
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
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'sample.[name].css'
      })
    ]
  };

  return config;
};
