const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const VENDOR_LIBS = [
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'moment',
  'cookies-js',
  'cropperjs',
  'deep-diff',
  'dropzone',
  'hellojs',
  'jquery-serializejson',
  'socket.io-client',
];

module.exports = {
  entry: {
    vendor: VENDOR_LIBS,
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.(scss|sass)$/i,
        include: [
          'node_modules',
          path.resolve(__dirname, './src/sass'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: ['file-loader', 'image-webpack-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000',
      }
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    // extensions: ['.js', '.sass', '.scss', '.css'],
  },
  plugins: [
    new HtmlPlugin({
      title: 'GrowthFountain | Equity Crowdfunding Platform',
      template: './src/index.pug',
      someProp: 'Property from config',
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true,
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery',
      '$': 'jquery',
      'window.jQuery': 'jquery',
      'Tether': 'tether',
      'window.Tether': 'tether',
      '_': 'underscore',
      'Backbone': 'backbone',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
  ],
  devServer: {
    // contentBase: path.resolve(__dirname, 'src'),
    port: 7070,
    // hot: true,
  },
};