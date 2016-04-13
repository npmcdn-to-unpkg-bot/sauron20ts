var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/bin');
var APP_DIR = path.resolve(__dirname, 'public/src');

var config = {
  entry: APP_DIR + '/app.js',
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  }
};

module.exports = config;
