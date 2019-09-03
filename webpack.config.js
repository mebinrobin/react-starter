const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    mode: "none",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/env",
                        "@babel/preset-react"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "build/"),
        publicPath: ".",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "build/"),
        port: 3000,
        publicPath: "http://localhost:3000/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "App",
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                useShortDoctype: true
            }
        })
    ]
};
