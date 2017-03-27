const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VENDOR_LIBS = [
  'jquery',
  'jquery-serializejson',
  'jquery.appear',
  'underscore',
  'backbone',
  'bootstrap',
  'tether',
  'bootstrap-select',
  'cookies-js',
  'cropperjs',
  'deep-diff',
  'dropzone',
  'hellojs',
  'moment',
  'owl.carousel',
  'parseuri',
  'socket.io-client',
];

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: VENDOR_LIBS,
  },
  devtool: 'eval-source',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].[id].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },

  devServer: {
    contentBase: './dist/',
    historyApiFallback: true,
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
    new HtmlWebpackPlugin({
      title: 'GrowthFountain | Equity Crowdfunding Platform',
      template: './src/index.pug',
      filename: 'index.html',
      chunks: ['index', 'vendor'],
      inject: 'body', // Inject all scripts into the body
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'window.jQuery': 'jquery',//for owl.carousel
      'jQuery': 'jquery',//for Bootstrap
      'Tether': 'tether',
      'window.Tether': 'tether',
      '_': 'underscore',
      'Backbone': 'backbone',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    // new BundleAnalyzerPlugin(),
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
