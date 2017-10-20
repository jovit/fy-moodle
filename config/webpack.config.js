var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/../src/js',

    entry: {
        background: './background.js',
        answer: './answer.js',
        reload: './reload.js',
        scan: './scan.js'
    },

    output: {
        path: path.resolve(__dirname, '../build'),
        pathinfo: true,
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },

    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /\/node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.tpl$/,
                loader: 'raw'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.png$/,
                loader: 'url?limit=10000&name=assets/[name].[ext]'
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.json'],
        modulesDirectories: [
            '../node_modules',
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({})
    ]
};
