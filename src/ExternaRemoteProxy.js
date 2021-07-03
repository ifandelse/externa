
import machina from "machina";
import { createUUID } from "./helpers";
import state from "./state";
import { logger as _logger } from "./logger";

let _userHandlers = {};

export function setHandlers( handlers ) {
	_userHandlers = handlers;
}

export { _userHandlers as userHandlers };

const packingSlips = {
	ping() {
		return {
			type: "externa.ping",
			timeStamp: new Date(),
			ticket: createUUID(),
			instanceId: state.instanceId,
		};
	},
	pong( { instanceId, timeStamp, ticket, } ) {
		return {
			type: "externa.pong",
			instanceId: state.instanceId,
			timeStamp: new Date(),
			pingData: {
				instanceId,
				timeStamp,
				ticket,
			},
		};
	},
	message( type, message ) {
		return {
			type: "externa.message",
			instanceId: state.instanceId,
			timeStamp: new Date(),
			envelope: {
				type,
				message,
			},
		};
	},
	disconnect() {
		return {
			type: "externa.disconnect",
			timeStamp: new Date(),
			instanceId: state.instanceId,
		};
	},
};

const ExternaRemoteProxy = machina.Fsm.extend( {
	initialize( options, target, instanceId ) {
		this.target = target;
		this.instanceId = instanceId;
		this.handshakeComplete = false;
		this.logger = msg => {
			_logger( `[remote-proxy] ${ msg }` );
		};
	},

	initialState: "uninitialized",

	states: {
		uninitialized: {
			disconnect: "disconnected",
			sendPing: "pinging",
			receivePing( ping ) {
				this.instanceId = ping.instanceId;
			},
			sendPong() {
				this.deferUntilTransition( "ponging" );
				this.transition( "ponging" );
			},
		},
		pinging: {
			_onEnter() {
				const payload = packingSlips.ping();
				this.logger( `pinging: ${ JSON.stringify( payload ) }` );
				this.send( payload );
			},
			disconnect: "disconnected",
			receivePong( pong ) {
				this.instanceId = pong.instanceId;
				this.handshakeComplete = true;
				this.logger( `completed handshake with ${ this.instanceId }` );
				this.transition( "connected" );
			},
			receivePing( ping ) {
				this.instanceId = ping.instanceId;
			},
			sendPong() {
				this.deferUntilTransition( "ponging" );
				this.transition( "ponging" );
			},
			receiveMessage() {
				this.deferUntilTransition( "connected" );
			},
			sendMessage() {
				this.deferUntilTransition( "connected" );
			},
		},
		ponging: {
			sendPong( ping ) {
				const payload = packingSlips.pong( ping );
				this.logger( `ponging: ${ JSON.stringify( payload ) }` );
				this.send( payload );
				this.transition( "connected" );
			},
		},
		connected: {
			ping: "pinging",
			disconnect: "disconnected",
			receiveMessage( envelope ) {
				this.logger( `received message from ${ this.instanceId } ${ JSON.stringify( envelope ) }` );
				const handler = _userHandlers[ envelope.type ];
				if ( handler ) {
					handler( envelope.message );
				} else {
					this.logger( `no user handler for: ${ JSON.stringify( envelope ) }` );
				}
			},
			sendMessage( type, msg ) {
				const payload = packingSlips.message( type, msg );
				this.logger( `sending msg: ${ JSON.stringify( payload ) }` );
				this.send( payload );
			},
		},
		disconnected: {
			_onEnter() {
				const payload = packingSlips.disconnect();
				this.logger( `sending disconnect: ${ JSON.stringify( payload ) }` );
				this.send( payload );
			},
		},
	},

	sendPing() {
		this.handle( "sendPing" );
	},

	receivePing( ping ) {
		this.handle( "receivePing", ping );
	},

	sendPong( ping ) {
		this.handle( "sendPong", ping );
	},

	receivePong( pong ) {
		this.handle( "receivePong", pong );
	},

	sendMessage( type, msg ) {
		this.handle( "sendMessage", type, msg );
	},

	receiveMessage( { envelope, } ) {
		this.handle( "receiveMessage", envelope );
	},

	send( payload ) {
		this.target.postMessage( {
			externa: true,
			payload,
		} );
	},

	disconnect() {
		this.handle( "disconnect" );
	},
} );

export { ExternaRemoteProxy };
