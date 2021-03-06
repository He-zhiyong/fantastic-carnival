/**
 * Created by li on 2018/2/1 17:12.
 */
const webpackMerge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const baseConfig = require('./webpack.base.config')

const config = webpackMerge(baseConfig,{
    entry:{
        vendor:['vue','vue-router','vuex','axios','lodash'],
    },
    output:{
        filename:'js/[name].[chunkhash:8].js',
        chunkFilename:'chunk/[name].[chunkhash:8].js',
        path: path.join(__dirname, '../../server/static/adminDist'),
        publicPath:'./adminDist/',
    },
    module:{
        rules:[
            {
                test : /\.js$/,
                loader:'babel-loader',
                include : path.join(__dirname , '../src'),
                options:{
                    plugins:['syntax-dynamic-import']
                }
            },
            {
                test : /\.vue$/,
                loader:'vue-loader',
                options:{
                    extractCSS:true
                }
            },
            {
                test:/\.styl/,
                use: ExtractPlugin.extract({
                    fallback:'style-loader',
                    use:[
                        'css-loader',
                        {
                            loader:'postcss-loader',
                            options:{
                                sourceMap:true
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }
        ]
    },
    plugins:[
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime'
        }),
        new ExtractPlugin('css/styles.[contentHash:8].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            output:{
                comments:false,
            },
            sourceMap:true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions:{
                safe:true
            }
        })
    ]
})

module.exports = config