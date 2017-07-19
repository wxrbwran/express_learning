const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const Visualizer = require('webpack-visualizer-plugin');
const HappyPack = require('happypack');

const DIST_DIR = 'dist';
const ASSET_DIR = 'assets';
const JS_DIR = 'js';
const CSS_DIR = 'css';
const IMG_DIR = 'img';
const FONT_DIR = 'font';

console.log(`当前运行环境:${process.env.NODE_ENV}`);
console.log(__dirname);
// base config
const config = {
  devtool: 'module-source-map',
  entry: {
    // only add Promise global var
    // app: ['core-js/fn/promise', 'core-js/fn/array/includes',
    //   path.join(__dirname, 'client/index.jsx')],
    // add all es6 global vars. eg. Set Map String.includes...
    app: ['babel-polyfill', 'core-js/fn/array',
      path.join(__dirname, 'client/index.jsx')],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'react-router',
      'react-router-redux',
      'qs',
      'axios',
      'moment',
    ],
  },
  output: {
    path: path.join(__dirname, DIST_DIR),
    publicPath: '/',
    filename: path.join(ASSET_DIR, JS_DIR, '[name].[chunkhash].js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    // modules: [
    //   path.resolve(__dirname, 'client/config'),
    //   'node_modules',
    //   path.resolve(__dirname, './node_modules'),
    // ],
    alias: {
      config: path.join(__dirname, 'client/config/local.js'),
      components: path.join(__dirname, 'client/components'),
      containers: path.join(__dirname, 'client/containers'),
      utils: path.join(__dirname, 'client/utils'),
      apis: path.join(__dirname, 'client/apis'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   enforce: 'pre',
      //   use: 'happypack/loader',
      //   exclude: /node_modules/,
      //   include: __dirname,
      // },
      {
        test: /\.jsx?$/,
        use: ['happypack/loader'],
        exclude: /node_modules/,
        include: __dirname,
      }, {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: `${ASSET_DIR}/${IMG_DIR}/[name].[hash:8].[ext]`,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              progressive: true,
              gifsicle: {
                interlaced: true,
              },
              optipng: {
                optimizationLevel: 5,
              },
              pngquant: {
                quality: '75-85',
                speed: 4,
              },
              mozjpeg: {
                quality: 75,
              },
            },
          },
        ],
      },
      // 字体
      {
        test: /\.((ttf|eot|woff|svg)(\?t=[0-9]\.[0-9]\.[0-9]))|(ttf|eot|woff|svg)\??.*$/,
        // test: /\.(ttf|eot|woff|svg)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `./${ASSET_DIR}/${FONT_DIR}/[name].[hash:8].[ext]`,
          },
        }],
      },
    ],
  },
  plugins: [
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: path.join(ASSET_DIR, JS_DIR, 'vendor.[hash:8].js'),
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'client/index.html'),
      filename: 'index.html',
      title: '心之力医生',
      minify: false,
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new Visualizer(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

// 开发环境
if (process.env.NODE_ENV === 'local' ||
  process.env.NODE_ENV === 'development') {
  config.module.rules.push({
    test: /\.(scss|css)$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
    }, {
      loader: 'postcss-loader',
    }, {
      loader: 'sass-loader',
      options: {
        data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, 'client/assets')],
      },
    }],
  });
}
if (process.env.NODE_ENV === 'development') {
  config.resolve.alias.config = path.join(__dirname, 'client/config/dev.js');
}
// 生产环境
if (process.env.NODE_ENV === 'production') {
  config.resolve.alias.config = path.join(__dirname, 'client/config/prod.js');
  config.plugins.push(new FastUglifyJsPlugin({
    compress: { warnings: false },
    sourceMap: false,
    drop_console: true,
    drop_debugger: true,
    output: { comments: false },
    // 默认缓存路径为项目根目录，手动配置请使用:
    cacheFolder: path.resolve(__dirname, '.uglifyJsCache'),
    // 工作进程数，默认os.cpus().length
    workerNum: 4,
  }),
    new ExtractTextPlugin({
      filename: path.join(ASSET_DIR, CSS_DIR, 'app.[hash:8].css'),
      allChunks: true,
    }));
  config.module.rules.push({
    test: /\.(scss|css)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          minimize: true,
        },
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
        options: {
          data: '@import "theme/_config.scss";',
          includePaths: [path.resolve(__dirname, 'client/assets')],
        },
      }],
    }),
  });
}

module.exports = (env) => {
  console.log('Running with env config: ', config.resolve.alias.config);
  config.plugins.push(new HappyPack({
    loaders: ['babel-loader', 'eslint-loader'],
    threads: 4,
  }));
  if (env && env.serve) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), new DashboardPlugin()
    );
    config.entry.app = [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:3001',
      'webpack/hot/only-dev-server',
    ].concat(config.entry.app);
    config.devServer = {
      publicPath: config.output.publicPath,
      hot: true,
      inline: true,
      port: 3001,
      historyApiFallback: true,
      host: '0.0.0.0',
    };
  }
  return config;
};
