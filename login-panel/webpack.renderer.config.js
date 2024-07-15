const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

// Remove the existing CSS rule from rules if it exists
const filteredRules = rules.filter(rule => !rule.test || !rule.test.toString().includes('.css'))

module.exports = {
    module: {
        rules: [
            ...filteredRules,
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: false,
                },
            }),
        ],
    },

    plugins: plugins.rendererPlugins,
    target: 'electron-renderer',
    resolve: {
        alias: {
            Globals: path.resolve(__dirname, 'src/Globals/'),
            Assets: path.resolve(__dirname, 'src/Assets/'),
            Images: path.resolve(__dirname, 'src/Images/'),
            Pages: path.resolve(__dirname, 'src/Pages/'),
            Plugins: path.resolve(__dirname, 'src/Plugins/'),
            Styles: path.resolve(__dirname, 'src/Styles/'),
            Utils: path.resolve(__dirname, 'src/Utils/'),
        },
        fallback: {
            path: require.resolve('path-browserify'),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.jpg'],
    },
}