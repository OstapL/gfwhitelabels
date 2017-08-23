const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isAnalyze = process.env.NODE_ENV === 'analyze';
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  new HtmlPlugin({
    title: 'GrowthFountain | Equity Crowdfunding Platform',
    template: './src/index.pug',
    filename: 'index.html',
    inject: 'head',
  }),
  new ExtractTextPlugin({
    filename: 'styles.[name].[hash].css',
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
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].[hash].js',
    minChunks: Infinity,
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  }),
];

if (isProd || isAnalyze) {
  plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
      output: { comments: false },
    }));
  plugins.push(new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true,
    dry: false,
  }));
}

if (isAnalyze) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  plugins.push(new BundleAnalyzerPlugin());
}

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new BrowserSyncPlugin({
    // browse to http://localhost:3000/ during development
    host: 'localhost',
    port: 7070,
    // proxy the Webpack Dev Server endpoint
    // (which should be serving on http://localhost:3100/)
    // through BrowserSync
    proxy: 'http://localhost:7070/'
  }, {
    reload: false,
  }));
}

const dependencies = Object.keys(require('./package.json').dependencies);
const lazyDependencies = ['dropzone', 'socket.io-client', 'cropperjs'];

const baseDependencies = dependencies.filter((dep) => {
  return !lazyDependencies.find(authDep => authDep == dep);
});

module.exports = {
  entry: {
    vendor: baseDependencies,
    index: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    pathinfo: !isProd,
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
        include: [
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'resolve-url-loader',
          ],
        }),
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
       test: /\.(mp3|mp4|webm)$/,
       loader: 'file-loader',
       include: [
          path.resolve(__dirname, './staticdata'),
        ],
     },
     {
       test: /\.(pdf|doc|docx)$/,
       include: [
          path.resolve(__dirname, './staticdata'),
        ],
        loaders: [
          {
            loader: 'file-loader',
            query: {
              name: '[path][name].[hash].[ext]',
            }
          },
        ],
     },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/i,
        include:[
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './staticdata'),
        ],
        loaders: [
          {
            loader: 'file-loader',
            query: {
              name: '[path][name].[hash].[ext]',
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
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            query: '[path][name].[hash].[ext]',
          }
        ],
      }
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'consts'),
      images: path.resolve(__dirname, 'staticdata/img'),
      video: path.resolve(__dirname, 'staticdata/video'),
      doc: path.resolve(__dirname, 'staticdata/doc'),
    },
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, ''),
    ],
    extensions: ['.js', '.sass', '.scss', '.css'],
  },
  plugins: plugins,
  devtool: isProd ? false :'eval',
  watch: isDev,
  devServer: {
    historyApiFallback: true,
    port: 7070,
    host: '0.0.0.0',
    disableHostCheck: true,
    //this can be used only on local machine,
    //to open app hosted on local machine from mobile phone you need to use disableHostCheck prop;
    // public: 'local.growthfountain.com',
    hot: true,
    inline: true,
  },
};

