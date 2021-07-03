
import state from "./state";
import { ExternaRemoteProxy } from "./ExternaRemoteProxy";
import { getWindowAdapterFsm } from "./windowAdapterFsm";
import { logger } from "./logger";

export function postMessageListener( event ) {
	if ( event.data.externa ) {
		const source = event.source;
		const payload = event.data.payload;
		let remote = state.knownExternals.get( source );
		if ( !remote ) {
			logger( `received externa message from unknown source: ${ payload.instanceId }` );
			remote = new ExternaRemoteProxy( {}, source, payload.instanceId );
			state.knownExternals.set( source, remote );
		}
		getWindowAdapterFsm().handleMessage( payload.type, { data: payload, remote, } );
	}
}
