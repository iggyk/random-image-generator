const path = require("path");

module.exports = {
    entry: './src/web/web.js',
    output: {
        filename: 'web-app.js',
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: 'web-app.js.map'
    },
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    mode: "development"
};