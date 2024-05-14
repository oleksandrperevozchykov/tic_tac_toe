const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const PATHS = {
    entryPoint: path.resolve(__dirname, "src/app.ts"),
    dist: path.resolve(__dirname, "dist"),
};

class DoneTimeLogger {
    apply(compiler) {
        compiler.hooks.done.tap("DoneTimeLogger", (compilation) => {
            console.log(('\n[' + new Date().toLocaleString() + ']') + ' --- DONE.\n');
        });
    }
}

// Webpack config
module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    entry: {
        ["app.min"]: [PATHS.entryPoint],
    },
    output: {
        path: PATHS.dist,
        filename: "[name].js",
        libraryTarget: "umd",
        library: "tic_tac_toe",
        umdNamedDefine: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    mangle: true,
                    compress: true,
                    output: {
                        beautify: false,
                    },
                },
            }),
        ],
    },
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
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new DoneTimeLogger(),
    ],
    externals: [],
    watch: false,
    stats: 'errors-warnings'
};
