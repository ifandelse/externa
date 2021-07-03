const path = require( "path" );

const pkg = require( "./package.json" );
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );

const banner = `${ pkg.name } - ${ pkg.description }
Author: ${ pkg.author }
Version: v${ pkg.version }
Url: ${ pkg.homepage }
License(s): ${ pkg.license }`;

const source = path.join( __dirname, "src", "index.js" );

module.exports = {
	mode: "production",
	entry: {
		externa: source,
	},
	output: {
		path: path.resolve( __dirname, "dist" ),
		filename: "externa.min.js",
		library: {
			name: "externa",
			type: "umd",
			export: "default",
		},
		globalObject: "this",
		clean: true,
	},
	externals: {
		machina: "machina",
		debug: "debug",
	},

	optimization: {
		minimize: true,
	},
	devtool: "source-map",
	plugins: [
		new webpack.BannerPlugin( banner ),
		new UnminifiedWebpackPlugin( { postfix: "", } ),
	],
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
			},
		],
	},
};
