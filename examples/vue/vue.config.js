
const path = require( "path" );
const webpack = require( "webpack" );
const WorkerPlugin = require( "worker-loader" )

module.exports = {
	parallel: false,
	pages: {
		index: {
			entry: "src/main.js",
			template: "public/index.html",
			filename: "index.html",
			chunks: [ "chunk-vendors", "chunk-common", "main", "index", ],
			title: "Externa Vue Example"
		},
		iframe: {
			entry: "src/iframe.js",
			template: "public/iframe.html",
			filename: "iframe.html",
			chunks: [ "chunk-vendors", "chunk-common", "iframe", ],
		},
	},
	configureWebpack: {
		cache: false,
		module: {
			rules: [
				{
					test: /\.worker\.js$/i,
					use: [
						{
							loader: "worker-loader",
						},
						{
							loader: "babel-loader",
							options: {
								presets: [ "@babel/preset-env" ],
							},
						},
					],
				},
			],
		},
	},
};
