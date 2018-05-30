const path = require('path');

module.exports = {
    entry: './demo/index.js',
    output: {
        path: path.resolve('build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader'
        }]
    }
};