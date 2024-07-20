const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.ts',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
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
    plugins: [new HtmlWebpackPlugin({
        template: './index.html'
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