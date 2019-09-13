const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env) => {
    const isProduction = env.production === true;
    const isDevelopment = env.development === true;

    return Object.assign({
        entry: resolve(__dirname, 'src/index.js'),
        mode: isDevelopment ? 'development' : isProduction && 'production',
        module: {
            rules: [{
                test: /\.js$/,
                include: [
                    resolve(__dirname, 'src')
                ],
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            }, {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    'sass-loader'
                ]
            }]
        },
        output: {
            path: resolve(__dirname, 'build/'),
            publicPath: './',
            filename: '[name].[contenthash].js'
        },
        optimization: {
            moduleIds: 'hashed',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        name: 'vendors',
                        chunks: 'all'
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
                template: resolve(__dirname, 'src/static/index.html'),
                favicon: resolve(__dirname, 'src/static/favicon.ico'),
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
                chunkFilename: '[id].[name].[contenthash].css',
                ignoreOrder: false
            })
        ],
        devtool: isDevelopment ? 'inline-source-map' : 'source-map',
        devServer: {
            port: 3000,
            publicPath: 'http://localhost:3000/'
        },
        stats: {
            children: false
        }
    });
};
