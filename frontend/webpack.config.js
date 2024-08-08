const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    cache: false,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        liveReload: true,
        compress: true,
        port: 9003,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './index.html',
            cache: false
    }),
        new CopyPlugin({
            patterns: [
            
                { from: "./src/templates", to: "templates" },
                { from: "./src/static/images", to: "images" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "css" },
                { from: "./node_modules/@fortawesome/fontawesome-free/css/all.css", to: "css" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js" },
                { from: "./node_modules/@fortawesome/fontawesome-free/js/all.js", to: "js" },
                { from: "./node_modules/jquery/dist/jquery.js", to: "js" },
                { from: "./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.css", to: "css" },
                { from: "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js", to: "js" },
                { from: "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js", to: "js" },
                { from: "./node_modules/moment/min/moment.min.js", to: "js" },
                { from: "./node_modules/moment/min/locales.js", to: "js" },
            ],
        }),
    ],

};