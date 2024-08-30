const CircularDependencyPlugin = require("circular-dependency-plugin");
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
    plugins: [
        new CircularDependencyPlugin({
          // exclude detection of files based on a RegExp
          exclude: /node_modules/,
          // add errors to webpack instead of warnings
          failOnError: true,
          // allow import cycles that include an asyncronous import,
          // e.g. via import(/* webpackMode: "weak" */ './file.js')
          allowAsyncCycles: false,
          // set the current working directory for displaying module paths
          cwd: process.cwd(),
        }),
    ],
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