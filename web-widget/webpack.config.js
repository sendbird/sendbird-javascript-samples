module.exports = {
  context: __dirname + '/src',
  entry: {
    widget: ['babel-polyfill', './js/widget.js']
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].SendBird.js'
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es2015']
          }
        }
      }
    ]
  }
};
