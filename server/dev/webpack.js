
const webpack = require('webpack')
const ip	  = require('ip')
let   env     = process.env.NODE_ENV.split('.')
	  env     = {target : env[0], mode : env[1]}
// var externals  = require('webpack-node-externals')

let config = {
	entry   : {
		// './index.js' : './src/index.js',
		'./www/client/build/index.js' : './www/client/src/index.js',
		'./www/wall/build/index.js' : './www/wall/src/index.js'
	},
	devtool   : 'source-map',
	// target    : 'node',
	// externals : [externals()],
	module  : {
		loaders	: [
			// coffee
			{ 
				test     : /\.(coffee)$/,
				loader   : 'coffee-loader',
				exclude	 : /node_modules/
			},
			// es6
			{
				test	: /\.(js)$/,
				loader	: 'babel-loader',
				query	: {presets: ["es2015"]},
				exclude	: /node_modules/
			},
			// sass
			{
				test    : /\.(sass)$/,
				loaders : ['style-loader', 'css-loader', 'sass-loader?sourceMap'],
				exclude	: /node_modules/
			},
			{
				test: /\.(ttf|svg)$/,
				loader: 'file-loader?name=./graphic/[name].[ext]'
			},
			{
				test: /\.(jpg|png|svg)$/, 
				loader: 'url-loader'
			}
		]
	},
	/*resolve : {
		alias : {
			fw : '/Users/antonkluev/Desktop/Dev/web/libs/fw/src/'
		}
	}*/
};

let out = {
	output  : {
		filename      : '[name]',
		libraryTarget : 'umd',
		library       : 'fw'
	}
};

// browser dev
if (env.target == 'client') Object.assign(config, {
	output    : {filename : '[name]'},
	devServer : {
		contentBase : './',
		stats       : 'errors-only',
		host        : ip.address(),
		inline      : true,
		hot         : true,
		port        : 8080
	},
	plugins : [
		new webpack.HotModuleReplacementPlugin()
	]
});

// server dev
else if (env.target == 'server') Object.assign(config, out, {
	watch : true
});

// build
else if (env.target == 'build') Object.assign(config, out, {
	plugins : [
		new webpack.optimize.UglifyJsPlugin({
			output    : {comments: false},
			sourceMap : true
		})
	]
});

module.exports = config;
