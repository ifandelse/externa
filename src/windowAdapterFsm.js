import machina from "machina";
import { logger } from "./logger";

let fsmInstance;

export function getWindowAdapterFsm() {
	if ( !fsmInstance ) {
		fsmInstance = new machina.Fsm( {
			initialize() {
				this.logger = msg => {
					logger( `[window-adapter-fsm] ${ msg }` );
				};
			},
			initialState: "uninitialized",
			states: {
				uninitialized: {
					init: "ready",
					"externa.message"() {
						this.logger( "externa has not been initialized, but is receiving messages. Be sure to call externa.init()." );
						this.deferUntilTransition( "ready" );
					},
					"externa.ping"() {
						this.logger( "externa has not been initialized, but is receiving pings. Be sure to call externa.init()." );
						this.deferUntilTransition( "ready" );
					},
					"externa.pong"() {
						this.logger( "externa has not been initialized, but is receiving pongs. Be sure to call externa.init()." );
						this.deferUntilTransition( "ready" );
					},
				},
				ready: {
					pause: "paused",
					"externa.message"( { data, remote, } ) {
						this.logger( "NORMAL MESSAGE FROM:", data.instanceId, remote.state );
						remote.receiveMessage( data );
					},
					"externa.ping"( { data, remote, } ) {
						this.logger( "PING MESSAGE FROM:", data.instanceId, remote.state );
						remote.receivePing( data );
						remote.sendPong( data );
					},
					"externa.pong"( { data, remote, } ) {
						this.logger( "PONG MESSAGE FROM:", data.instanceId, remote.state );
						remote.receivePong( data );
					},
				},
				paused: {
					resume: "ready",
					"externa.message"() {
						this.deferUntilTransition( "ready" );
					},
					"externa.ping"() {
						this.deferUntilTransition( "ready" );
					},
					"externa.pong"() {
						this.deferUntilTransition( "ready" );
					},
				},
			},

			init() {
				this.handle( "init" );
			},

			pause() {
				this.handle( "pause" );
			},

			resume() {
				this.handle( "resume" );
			},

			handleMessage( type, options ) {
				this.handle( type, options );
			},
		} );
	}
	return fsmInstance;
}
