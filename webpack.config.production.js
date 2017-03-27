const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

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
  'parseuri',//for socket.io-client
  'socket.io-client',
];

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: VENDOR_LIBS,
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.[name].[hash].js',
  },

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [
      './',
      'js',
      'src',
      'node_modules',
    ],
  },

  debug: false,

  plugins: [
    new HtmlWebpackPlugin({
      title: 'GrowthFountain | Equity Crowdfunding Platform',
      template: './src/index.pug',
      filename: 'index.html',
      inject: 'body', // Inject all scripts into the body
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'window.jQuery': 'jquery',//for owl.carousel
      'jQuery': 'jquery',//for Bootstrap
      'window.Tether': 'tether',//for Bootstrap
      '_': 'underscore',
      'Backbone': 'backbone',
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
      output: { comments: false },
    }),
    new cleanWebpackPlugin(['dist'], {  //TODO: it looks like mistake
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
  ],

  module: {
    loaders: [
      {
        test: /bootstrap\/js\//,
        loader: 'imports?jQuery=$'
      },
      {
        test: /\.html?$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(scss|sass)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        loader: 'url?limit=8192&mimetype=image/png'
      },
      {
        test: /\.jpe?g$/,
        loader: 'url?limit=8192&mimetype=image/jpg'
      },
      {
        test: /\.gif$/,
        loader: 'url?limit=8192&mimetype=image/gif'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=8192&mimetype=image/svg+xml'
      },
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
      {
        test: /\.md$/,
        loaders: ['html', 'markdown']
      },
    ],
  },
};
