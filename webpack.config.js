const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// plugins
const htmlWebpack = new HtmlWebPackPlugin({
	template: './src/index.html',
	filename: './index.html'
});
const extractSass = new ExtractTextPlugin({
	filename: 'custom.min.css',
	disable: process.env.NODE_ENV === 'development'
});


module.exports = {
	output: {
		path: __dirname + '/dist',
		filename: 'main.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: extractSass.extract({
					use: [
						{ loader: 'css-loader' },
						{ 
							loader: 'sass-loader',
							options: {
								outputStyle: 'compressed'
							}
						}
					],
					fallback: 'style-loader'
				})
			}
		]
	},
	plugins: [
		htmlWebpack,
		extractSass
	]
};
