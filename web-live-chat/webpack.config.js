module.exports = {
  context: __dirname + '/src',
  entry: {
    liveChat: './js/chat.js'
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
        exclude: /(node_modules|bower_components|SendBird.min.js)/,
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
        exclude: /(node_modules|bower_components)/,
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
