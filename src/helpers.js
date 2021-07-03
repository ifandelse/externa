
import state from "./state";

export function createUUID() {
	const s = [];
	const hexDigits = "0123456789abcdef";
	/* eslint-disable no-magic-numbers */
	for ( let i = 0; i < 36; i++ ) {
		s[ i ] = hexDigits.substr( Math.floor( Math.random() * 0x10 ), 1 );
	}
	s[ 14 ] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	/* jshint ignore:start */
	s[ 19 ] = hexDigits.substr( ( s[ 19 ] & 0x3 ) | 0x8, 1 ); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	/* jshint ignore:end */
	s[ 8 ] = s[ 13 ] = s[ 18 ] = s[ 23 ] = "-";
	/* eslint-enable no-magic-numbers */
	return s.join( "" );
}

export function getExternals() {
	if ( state.isWorker ) {
		return [ this, ]; // eslint-disable-line no-invalid-this
	}
	const targets = [ ...document.getElementsByTagName( "iframe" ), ].map( i => {
		return i.contentWindow;
	} );
	if ( window.parent && window.parent !== window ) {
		targets.push( window.parent );
	}
	// TODO: determine if we need to include workers here?
	return targets;
}
