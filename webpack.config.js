const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/app.js',
  devtool: 'eval-source',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: './dist/',
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: 7070,
    host: '0.0.0.0',
    stats: {
      colors: true,
    },
  },

  resolve: {
    extensions: ['', '.js', '.pug', '.sass', '.scss'],
    modulesDirectories: [
      './src',
      './',
      './node_modules',
    ],
  },

  debug: true,

  plugins: [
    // new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      title: 'GrowthFountain | Equity Crowdfunding Platform',
      template: './src/index.pug',
      filename: 'index.html',
      inject: 'body', // Inject all scripts into the body
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether',
      Backbone: 'backbone',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    loaders: [
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=$' },
      { test: /\.html?$/, loader: 'file?name=[name].[ext]' },
      { test: /\.pug$/, loader: 'pug-loader' },
      { test: /\.json$/, exclude: /node_modules/, loader: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: ['es2015'] },
      },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      { test: /\.sass$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.png$/, loader: 'url?limit=8192&mimetype=image/png' },
      { test: /\.jpe?g$/, loader: 'url?limit=8192&mimetype=image/jpg' },
      { test: /\.gif$/, loader: 'url?limit=8192&mimetype=image/gif' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=image/svg+xml' },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=8192&mimetype=application/font-woff2',
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=8192&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=8192&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=8192&mimetype=application/octet-stream',
      },
      { test: /\.md$/, loaders: ['html', 'markdown'] },
    ],
  },
};
