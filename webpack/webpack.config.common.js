const path = require('path')
const globImporter = require('node-sass-glob-importer')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const webpackConfig = {
    entry: {
        app: './app/app.js',
        style: './app/assets/scss/style.scss'
    },
    optimization: {
        splitChunks: {
            // name: 'app'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['stylelint', {}],
                                    ['autoprefixer', {}]
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: [/node_modules/],
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                importer: globImporter()
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['stylelint', {}],
                                    ['autoprefixer', {}]
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: {
                    loaders: {
                        scss: [
                            'vue-style-loader',
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    sassOptions: {
                                        importer: globImporter()
                                    }
                                }
                            }
                        ]
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            app: path.resolve('./app/app.js'),
            style: path.resolve('./app/assets/scss/style.scss')
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins: [
        new VueLoaderPlugin(),
        new ESLintPlugin()
    ]
}

module.exports = webpackConfig
