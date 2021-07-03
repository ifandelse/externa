import machina from "machina";
import _ from "lodash";

describe( "externa - windowAdapterFsm", () => {
	let moduleInstance,
		fsmInstance,
		machinaFsmSpy,
		logger;

	beforeEach( () => {
		logger = sinon.stub();

		machinaFsmSpy = sinon.spy( machina.Fsm );

		moduleInstance = global.proxyquire( "../src/windowAdapterFsm.js", {
			"./logger": { logger, },
			machina: { Fsm: machinaFsmSpy, },
		} );

		fsmInstance = moduleInstance.getWindowAdapterFsm();
	} );

	describe( "when instantiating the FSM instance", () => {
		let fsmOptions,
			machinaStub,
			dataStub,
			remoteStub;

		beforeEach( () => {
			fsmOptions = _.cloneDeep( machinaFsmSpy.getCall( 0 ).args[ 0 ] );
			machinaStub = {
				deferUntilTransition: sinon.stub(),
				handle: sinon.stub(),
				logger: sinon.stub(),
			};
			dataStub = { instanceId: "calzone", };
			remoteStub = {
				receiveMessage: sinon.stub(),
				receivePing: sinon.stub(),
				sendPong: sinon.stub(),
				receivePong: sinon.stub(),
				state: "REMOTE_STATE",
			};
		} );

		it( "should instantiate the FSM", () => {
			machinaFsmSpy.should.be.calledOnce().and.calledWithNew();
		} );

		describe( "when initializing the FSM", () => {
			it( "should set the instance logger", () => {
				fsmInstance.logger( "wo ist die calzone?" );
				logger.should.be.calledOnceWithExactly( "[window-adapter-fsm] wo ist die calzone?" );
			} );

			it( "should set the initialState and states object", () => {
				fsmInstance.state.should.eql( "uninitialized" );
				machinaFsmSpy.should.be.calledWithMatch( {
					states: {
						uninitialized: {
							init: "ready",
							"externa.message": sinon.match.func,
							"externa.ping": sinon.match.func,
							"externa.pong": sinon.match.func,
						},
						ready: {
							pause: "paused",
							"externa.message": sinon.match.func,
							"externa.ping": sinon.match.func,
							"externa.pong": sinon.match.func,
						},
						paused: {
							resume: "ready",
							"externa.message": sinon.match.func,
							"externa.ping": sinon.match.func,
							"externa.pong": sinon.match.func,
						},
					},
				} );
			} );
		} );

		describe( "with state-specific behavior", () => {
			describe( "when in the uninitialized state", () => {
				describe( "when calling 'externa.message'", () => {
					beforeEach( () => {
						fsmOptions.states.uninitialized[ "externa.message" ].call( machinaStub );
					} );

					it( "should log a warning that init needs to be called", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "externa has not been initialized, but is receiving messages. Be sure to call externa.init()." );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );

				describe( "when calling 'externa.ping'", () => {
					beforeEach( () => {
						fsmOptions.states.uninitialized[ "externa.ping" ].call( machinaStub );
					} );

					it( "should log a warning that init needs to be called", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "externa has not been initialized, but is receiving pings. Be sure to call externa.init()." );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );

				describe( "when calling 'externa.pong'", () => {
					beforeEach( () => {
						fsmOptions.states.uninitialized[ "externa.pong" ].call( machinaStub );
					} );

					it( "should log a warning that init needs to be called", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "externa has not been initialized, but is receiving pongs. Be sure to call externa.init()." );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );
			} );

			describe( "when in the ready state", () => {
				describe( "when calling 'externa.message'", () => {
					beforeEach( () => {
						fsmOptions.states.ready[ "externa.message" ].call( machinaStub, { data: dataStub, remote: remoteStub, } );
					} );
					it( "should that we've received a normal message", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "NORMAL MESSAGE FROM:", "calzone", "REMOTE_STATE" );
					} );
					it( "should tell the remote proxy to receive the message", () => {
						remoteStub.receiveMessage.should.be.calledOnceWithExactly( dataStub );
					} );
				} );

				describe( "when calling 'externa.ping'", () => {
					beforeEach( () => {
						fsmOptions.states.ready[ "externa.ping" ].call( machinaStub, { data: dataStub, remote: remoteStub, } );
					} );
					it( "should log that we've received a ping message", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "PING MESSAGE FROM:", "calzone", "REMOTE_STATE" );
					} );
					it( "should tell the remote proxy to receive the ping", () => {
						remoteStub.receivePing.should.be.calledOnceWithExactly( dataStub );
					} );

					it( "should tell the remote proxy to send a pong", () => {
						remoteStub.sendPong.should.be.calledOnceWithExactly( dataStub );
					} );
				} );

				describe( "when calling 'externa.pong'", () => {
					beforeEach( () => {
						fsmOptions.states.ready[ "externa.pong" ].call( machinaStub, { data: dataStub, remote: remoteStub, } );
					} );
					it( "should log that we've received a pong message", () => {
						machinaStub.logger.should.be.calledOnceWithExactly( "PONG MESSAGE FROM:", "calzone", "REMOTE_STATE" );
					} );
					it( "should tell the remote proxy to receive the pong", () => {
						remoteStub.receivePong.should.be.calledOnceWithExactly( dataStub );
					} );
				} );
			} );

			describe( "when in the paused state", () => {
				describe( "when calling 'externa.message'", () => {
					beforeEach( () => {
						fsmOptions.states.paused[ "externa.message" ].call( machinaStub );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );

				describe( "when calling 'externa.ping'", () => {
					beforeEach( () => {
						fsmOptions.states.paused[ "externa.ping" ].call( machinaStub );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );

				describe( "when calling 'externa.pong'", () => {
					beforeEach( () => {
						fsmOptions.states.paused[ "externa.pong" ].call( machinaStub );
					} );

					it( "should defer all input until the ready state", () => {
						machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ready" );
					} );
				} );
			} );
		} );

		describe( "with instance methods", () => {
			describe( "when calling init", () => {
				beforeEach( () => {
					fsmOptions.init.call( machinaStub );
				} );

				it( "should tell the FSM to handle init", () => {
					machinaStub.handle.should.be.calledOnceWithExactly( "init" );
				} );
			} );

			describe( "when calling pause", () => {
				beforeEach( () => {
					fsmOptions.pause.call( machinaStub );
				} );

				it( "should tell the FSM to handle pause", () => {
					machinaStub.handle.should.be.calledOnceWithExactly( "pause" );
				} );
			} );

			describe( "when calling resume", () => {
				beforeEach( () => {
					fsmOptions.resume.call( machinaStub );
				} );

				it( "should tell the FSM to handle resume", () => {
					machinaStub.handle.should.be.calledOnceWithExactly( "resume" );
				} );
			} );

			describe( "when calling handleMessage", () => {
				beforeEach( () => {
					fsmOptions.handleMessage.call( machinaStub, "MSG_TYPE", "MSG_OPTIONS" );
				} );

				it( "should tell the FSM to handle the type of message passed", () => {
					machinaStub.handle.should.be.calledOnceWithExactly( "MSG_TYPE", "MSG_OPTIONS" );
				} );
			} );
		} );
	} );

	describe( "when the FSM has already be instantiated", () => {
		it( "should return the FSM instance", () => {
			fsmInstance.should.equal( moduleInstance.getWindowAdapterFsm() );
		} );

		it( "should not create a new FSM instance", () => {
			machinaFsmSpy.callCount.should.eql( 1 );
			fsmInstance = moduleInstance.getWindowAdapterFsm();
			machinaFsmSpy.callCount.should.eql( 1 );
		} );
	} );
} );
