const path = require('path')
const appName = '[name].js'
const commonConfig = require('./webpack.config.common')
const { merge } = require('webpack-merge')

const webpackConfig = merge(commonConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/build/',
        filename: appName
    },
    devServer: {
        compress: true,
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        proxy: {
            '/api/*': 'http://localhost:3001',
            secure: false
        }
    }
})

module.exports = webpackConfig
