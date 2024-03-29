'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = 'production';

module.exports = () => {
  const config = {
    mode: 'production',
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
    performance: { hints: false },
    module: {
      rules: [
        {
          // SCSS/SASS
          test: /\.s[ac]ss$/i,
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
                loader: 'sass-loader',
                options: {
                  implementation: require("sass"),
                }
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
