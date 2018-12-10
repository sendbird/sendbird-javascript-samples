
const path = require('path');

module.exports = {
    mode: 'production',
    context: path.resolve('./src'),
    entry: {
        SyncManager: './syncManager.js',
    },
    output: {
        path: path.resolve('.'),
        filename: '[name].min.js',
        library: 'SyncManager',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                // ESLint
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules|localdb.min.js)/,
                loader: 'eslint-loader',
                options: { failOnError: true }
            },
            { // ES6
                test: /\.js($|\?)/i,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            }
        ]
    }
};