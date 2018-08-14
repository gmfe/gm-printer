const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    demo: './demo/index.js'
  },
  output: {
    path: path.resolve('build'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.less$/,
      use: [
        // 'style-loader',
        'css-loader',
        'postcss-loader',
        'less-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        // 'style-loader',
        'css-loader'
      ]
    }, {
      test: /(fontawesome-webfont|glyphicons-halflings-regular|iconfont)\.(woff|woff2|ttf|eot|svg)($|\?)/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'font/[name].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
  ],
  devServer: {
    compress: true,
    host: '0.0.0.0',
    inline: false,
    disableHostCheck: true
  }
}
