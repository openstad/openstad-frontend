const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {

//	devtool: 'eval-source-map',
    devtool: 'none',
//	mode: 'development',
    mode: 'production',
    entry: ['./src/lib.js'],

    resolve: {
        // This will only alias the exact import "react-native"
        alias: {
            'react-native$': 'react-native-web'
         },
    },
    output: {
        path: __dirname + '/../../../app-widgets/public/', //
      //	path: __dirname + '/dist',
        filename: 'js/index.js',
        //	filename: 'js/openstad-component.js',
        library: 'AppEditor',
        libraryTarget: 'window',
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },


    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css',
            ignoreOrder: false,
            minimize: true,
            sourceMap: true
        }),
    ],

    module: {
        rules: [

            {
                test: /\.js$/,
                exclude: /node_modules\/(?![@expo|expo\-av|react\-native\-video|react\-native|react\-native\-vector\-icons])/,
                use: {
                    loader: "babel-loader",

                }
            },
            {
                test: /\.css$/,
                use:[MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ['file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/',
                        'image-webpack-loader'
                     ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=fonts/'
            }
        ],
    },

}
