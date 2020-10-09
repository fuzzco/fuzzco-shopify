const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    mode: devMode ? 'development' : 'production',
    entry: ['@babel/polyfill', './src/js/main.js', './src/scss/main.scss'],
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserJSPlugin({
                test: /\.js(\?.*)?$/i
            })
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        }),
        new webpack.ProvidePlugin({
            _get: 'lodash/get'
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true }
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [require('postcss-preset-env')]
                        }
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src/')
        }
    }
}
