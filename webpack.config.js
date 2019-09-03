const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = (process.env.NODE_ENV || '').toLowerCase() != 'production';

module.exports = Object.assign({}, {
    entry: './src/index.js',
    mode: isDev ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/env',
                        '@babel/preset-react'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build/'),
        publicPath: './',
        filename: '[name].[contenthash].js'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(Object.assign({},
            {
                title: 'App',
                template: 'public/index.html',
                favicon: 'public/favicon.ico'
            },
            !isDev ? {
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    useShortDoctype: true
                }
            } : undefined
        ))
    ],
    devtool: isDev ? 'source-map' : 'none'
}, isDev && {
    devServer: {
        contentBase: path.resolve(__dirname, 'build/'),
        port: 3000,
        publicPath: 'http://localhost:3000/',
    }
});
