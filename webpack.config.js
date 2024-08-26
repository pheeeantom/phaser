var path = require('path');
module.exports = {
    devtool : 'source-map',
    mode: 'development',
    watch: true,
    context: __dirname + '/src',
    entry: './game',
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: '[name]-bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx', '.css'],        
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    }
}