const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/script.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'script.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimize: true
    },
    watch: true
}