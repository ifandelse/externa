
const path = require( "path" );
const webpack = require( "webpack" );

module.exports = {
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
	}
};
