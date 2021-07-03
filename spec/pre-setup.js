
const jsdom = require( "jsdom" );
const { JSDOM, } = jsdom;
global.dom = new JSDOM( "<html><body></body></html>" );
Object.assign( global, {
	window: global.dom.window,
	document: global.dom.window.document,
	navigator: global.dom.window.navigator,
	self: global.window,
	HTMLElement: global.dom.window.HTMLElement,
	BROWSER: false,
	_babelPolyfill: true,
} );
