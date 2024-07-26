const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 3000,
        open: true,
        hot: true,
    },
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'docs'),
        clean: true,
        filename: 'index.[contenthash].js',
        // assetsModuleFilename: 'assets/[hash][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            }
                        }
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                type: 'asset/resource'
            }
        ]
    }
}