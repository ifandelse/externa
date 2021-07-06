
import { postMessageListener } from "./inbound";
import state from "./state";
import { getExternals } from "./helpers";
import { ExternaRemoteProxy, setHandlers } from "./ExternaRemoteProxy";
import { getWindowAdapterFsm } from "./windowAdapterFsm";
import { setLogNamespace, logger } from "./logger";

window.addEventListener( "message", postMessageListener );

export default {
	knownExternals: state.knownExternals,

	init( options ) {
		state.instanceId = options.instanceId || state.instanceId;
		setLogNamespace( state.instanceId );
		logger( "initializing" );
		if ( options.handlers ) {
			setHandlers( options.handlers );
		} else {
			// eslint-disable-next-line no-console
			console.warn( "externa has not been configured with user handlers, so no inbound messages will be handled" );
		}
		getWindowAdapterFsm().init();
	},

	connect() {
		logger( "connecting" );
		getExternals().forEach( external => {
			let proxy = state.knownExternals.get( external );
			if ( !proxy ) {
				proxy = new ExternaRemoteProxy( {}, external );
				state.knownExternals.set( external, proxy );
			}
			proxy.sendPing();
		} );
	},

	// Intentionally not yet implemented
	connectWorker() {
		console.error( "Worker support has not been implemented yet" ); // eslint-disable-line no-console
	},

	disconnect() {
		logger( "disconnecting" );
		window.removeEventListener( "message", postMessageListener );
		// eslint-disable-next-line no-unused-vars
		for ( const [ key, external, ] of state.knownExternals ) {
			external.disconnect();
		}
		state.knownExternals.clear();
	},

	async resumeUponCompletion( workToBeDone ) {
		// TODO: throw here if FSM is not in ready state
		getWindowAdapterFsm().pause();
		await workToBeDone();
		getWindowAdapterFsm().resume();
	},

	sendMessage( type, msg ) {
		// eslint-disable-next-line no-unused-vars
		for ( const [ key, external, ] of state.knownExternals ) {
			external.sendMessage( type, msg );
		}
	},
};
