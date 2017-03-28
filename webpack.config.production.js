const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let package1 = require('./package.json');
const dependencies = Object.keys(package1.dependencies);

module.exports = {
  entry: {
    vendor: dependencies,
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.[hash].js',
    pathinfo: true,
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
        exclude: [/\/node_modules\//],
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader'],
      },
      {
        test: /\.(scss|sass)$/i,
        include: [
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
              }
            }],
        })
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        include:[
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src'),
        ],
        loaders: [
          {
            loader: 'file-loader',
            query: {
              name: '[path][name].[ext]',
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              bypassOnDebug: true,
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|otf)$/i,
        use: 'url-loader?limit=100000',
      }
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'consts'),
      images: path.resolve(__dirname, 'src/img'),
    },
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, ''),
    ],
    extensions: ['.js', '.sass', '.scss', '.css'],
  },
  plugins: [
    new HtmlPlugin({
      title: 'GrowthFountain | Equity Crowdfunding Platform',
      template: './src/index.pug',
      filename: 'index.html',
      inject: 'body',
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
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
      name: ['vendor', 'manifest'],
      minChunks: 2,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
      output: { comments: false },
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
  ],
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 7070,
    host: '0.0.0.0',
    hot: true,
    inline: true,
  },
};