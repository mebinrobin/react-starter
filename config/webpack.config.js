const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const BUILD_PATH = resolve(__dirname, '..', 'build');
const SOURCE_PATH = resolve(__dirname, '..', 'src');

module.exports = (env) => {
  const isProduction = env.production === true;
  const isDevelopment = env.development === true;

  return Object.assign({
    entry: {
        main: resolve(SOURCE_PATH, 'index.js')
    },
    mode: isDevelopment ? 'development' : isProduction && 'production',
    module: {
      rules: [{
        test: /\.js$/,
        include: SOURCE_PATH,
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
        include: SOURCE_PATH,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      }]
    },
    output: {
      path: BUILD_PATH,
      publicPath: './static/',
      filename: './static/[name].[contenthash:10].js'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        cacheGroups: {
            initialVendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'initial'
            }
        }
      },
      runtimeChunk: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false
        }),
        new OptimizeCssAssetsPlugin()
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: resolve(SOURCE_PATH, 'index.html'),
        minify: isProduction && {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true
        }
      }),
      new ScriptExtHtmlWebpackPlugin({
        inline: ['runtime'],
        defaultAttribute: 'defer'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].chunk.css',
        ignoreOrder: false
      }),
      new CopyPlugin([
        {
          from: resolve(__dirname, '..', 'public'),
          to: BUILD_PATH,
          ignore: ['index.html']
        }
      ])
    ],
    devtool: isDevelopment ? 'eval-source-map' : false,
    devServer: {
      port: 3000,
      publicPath: 'http://localhost:3000/',
      stats: 'minimal'
    }
  });
};
