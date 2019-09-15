const webpack = require('webpack');
const { resolve } = require('path');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_PATH = resolve(__dirname, '..', 'build/');

const webpackConfig = {
    entry: resolve(__dirname, '..', 'src/index.js'),
    mode: 'production',
    module: {
      rules: [{
        test: /\.js$/,
        include: [
          resolve(__dirname, '..', 'src')
        ],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        ]
      }, {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader
          // },
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }]
    },
    output: {
      path: BUILD_PATH,
      publicPath: './',
      filename: '[name].[contenthash].js'
    },
    optimization: {
      moduleIds: 'hashed',
      splitChunks: {
        chunks: 'all'
      }
      // minimizer: [
      //   new TerserPlugin({
      //     extractComments: false
      //   }),
      //   new OptimizeCssAssetsPlugin()
      // ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '..', 'src/index.html'),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true
        }
      })
      // new ScriptExtHtmlWebpackPlugin({
      //   inline: ['runtime'],
      //   defaultAttribute: 'defer'
      // }),
      // new MiniCssExtractPlugin({
      //   filename: '[name].[contenthash].css',
      //   chunkFilename: '[name].[contenthash].chunk.css',
      //   ignoreOrder: false
      // }),
      // new CopyPlugin([
      //   {
      //     from: resolve(__dirname, '..', 'public/'),
      //     to: BUILD_PATH,
      //     ignore: ['index.html']
      //   }
      // ])
    ]
};

let compiler = webpack(webpackConfig);

compiler.hooks.emit.tap('test', (params => {
  console.log(params.performance);
  rimraf.sync(BUILD_PATH);
}));

function onCompileComplete(err, stats) {
  if(err) {
    return console.error(err);
  }

  console.log(stats.toJson().entrypoints);
}

compiler.watch({
  aggregateTimeout: 100
}, onCompileComplete);
