const webpack = require('webpack'),
    path = require('path'),
    threadLoader = require('thread-loader'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    pkg = require('../package.json');


threadLoader.warmup({}, [
    'babel-loader',
    'style-loader',
    'sass-loader',
    'css-loader',
    'url-loader'
]);


module.exports = {
    mode: 'development',
    entry: {
        [pkg.name]: [
            path.resolve(__dirname, './src/index.js'),
            'webpack-hot-middleware/client?reload=true'
        ]
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        publicPath: '/'
    },
    //devtool: 'source-map',
    resolve: {
        modules: ['node_modules'],
        alias: {
            Assets: path.resolve(__dirname, "./src/assets"),
            Utils: path.resolve(__dirname, "./src/utils"),
            Services: path.resolve(__dirname, "./src/services"),
            Components: path.resolve(__dirname, "./src/components"),
            API: path.resolve(__dirname, "./src/api"),
        },
        extensions: [
            '.vue',
            '.js'
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: "vendor",
                    chunks: "initial",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js|.jsx$/,
                exclude: /node_modules/,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: false
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'thread-loader',
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'thread-loader',
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    'thread-loader',
                    'url-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            title: `${pkg.name} demo`,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
