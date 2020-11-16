const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {

//	devtool: 'eval-source-map',
	devtool: 'none',
//	mode: 'development',
	mode: 'production',
	entry: [ './src/lib.js'],

	output: {
//		path: __dirname + '/../../openstad-landing/packages/cms/lib/modules/admin-widgets/public/', //
		path: __dirname + '/dist',
		filename: 'js/index.js',
	//	filename: 'js/openstad-component.js',
    library: 'AppFrontend',
    libraryTarget: 'window',
	},

	externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
	},


  plugins: [
    new MiniCssExtractPlugin({
      //filename: 'css/default.css',
      filename: 'css/main.css', //
      ignoreOrder: false,
    }),
  ],

  optimization: {
		minimize: true,
    minimizer: [new TerserPlugin({
			test: /\.jsx?$/,
		})],
  },

	module: {
		rules: [
			{
				test: /\.json$/,
				loader: "json-loader"
			},

			{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",

        }
			},
      {
        test: /\.css/,
				exclude: [],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
					//		publicPath: '/public/path/to/',
			//				publicPath: '/../openstad-landing/lib/modules/choices-guide-widgets/public/css/', //
            },
          },
          'css-loader',
          'less-loader',
        ],
      },
			{
			  test: /\.(png|jpg|svg)$/,
			  loader: 'url-loader'
			}
		],
	},

}
