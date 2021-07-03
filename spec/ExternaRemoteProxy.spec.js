import machina from "machina";
import _ from "lodash";

describe( "externa - ExternaRemoteProxy", () => {
	let moduleInstance,
		fsmInstance,
		machinaExtendSpy,
		createUUID,
		targetStub,
		state,
		machinaStub,
		fsmOptions,
		logger;

	beforeEach( () => {
		logger = sinon.stub();
		state = {
			instanceId: "gelato",
		};
		targetStub = { postMessage: sinon.stub(), };
		machinaExtendSpy = sinon.spy( machina.Fsm, "extend" );
		createUUID = sinon.stub().returns( "EweEweEyeDee" );
		machinaStub = {
			deferUntilTransition: sinon.stub(),
			handle: sinon.stub(),
			logger: sinon.stub(),
			target: {
				postMessage: sinon.stub(),
			},
			transition: sinon.stub(),
			send: sinon.stub(),
		};

		moduleInstance = global.proxyquire( "../src/ExternaRemoteProxy.js", {
			"./logger": { logger, },
			machina,
			"./state": state,
			"./helpers": { createUUID, },
		} );

		fsmInstance = new moduleInstance.ExternaRemoteProxy( {}, targetStub, "calzone" );
		fsmOptions = _.cloneDeep( machinaExtendSpy.getCall( 0 ).args[ 0 ] );
	} );

	afterEach( () => {
		machinaExtendSpy.restore();
	} );

	describe( "with the FSM definition", () => {
		it( "should set the initial state and states object", () => {
			fsmInstance.state.should.eql( "uninitialized" );
			machinaExtendSpy.should.be.calledWithMatch( {
				initialState: "uninitialized",
				states: {
					uninitialized: {
						disconnect: "disconnected",
						sendPing: "pinging",
						receivePing: sinon.match.func,
						sendPong: sinon.match.func,
					},
					pinging: {
						_onEnter: sinon.match.func,
						disconnect: "disconnected",
						receivePong: sinon.match.func,
						receivePing: sinon.match.func,
						sendPong: sinon.match.func,
						receiveMessage: sinon.match.func,
						sendMessage: sinon.match.func,
					},
					ponging: {
						sendPong: sinon.match.func,
					},
					connected: {
						ping: "pinging",
						disconnect: "disconnected",
						receiveMessage: sinon.match.func,
						sendMessage: sinon.match.func,
					},
					disconnected: {
						_onEnter: sinon.match.func,
					},
				},
			} );
		} );
	} );

	describe( "with initialization", () => {
		it( "should set the target property", () => {
			fsmInstance.target.should.eql( targetStub );
		} );

		it( "should set the instanceId property", () => {
			fsmInstance.instanceId.should.eql( "calzone" );
		} );

		it( "should set the handshakeComplete property", () => {
			fsmInstance.handshakeComplete.should.be.false();
		} );

		it( "should set the instance logger", () => {
			fsmInstance.logger( "wo ist die carbonara?" );
			logger.should.be.calledOnceWithExactly( "[remote-proxy] wo ist die carbonara?" );
		} );
	} );

	describe( "with instance methods", () => {
		describe( "when calling sendPing", () => {
			beforeEach( () => {
				fsmOptions.sendPing.call( machinaStub );
			} );

			it( "should tell the FSM to handle sendPing", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "sendPing" );
			} );
		} );

		describe( "when calling receivePing", () => {
			beforeEach( () => {
				fsmOptions.receivePing.call( machinaStub, { instanceId: "8675309", } );
			} );

			it( "should tell the FSM to handle receivePing", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "receivePing", { instanceId: "8675309", } );
			} );
		} );

		describe( "when calling sendPong", () => {
			beforeEach( () => {
				fsmOptions.sendPong.call( machinaStub, { instanceId: "8675309", } );
			} );

			it( "should tell the FSM to handle sendPong", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "sendPong", { instanceId: "8675309", } );
			} );
		} );

		describe( "when calling receivePong", () => {
			beforeEach( () => {
				fsmOptions.receivePong.call( machinaStub, { instanceId: "8675309", } );
			} );

			it( "should tell the FSM to handle receivePong", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "receivePong", { instanceId: "8675309", } );
			} );
		} );

		describe( "when calling sendMessage", () => {
			beforeEach( () => {
				fsmOptions.sendMessage.call( machinaStub, "Calzone", { instanceId: "8675309", } );
			} );

			it( "should tell the FSM to handle sendMessage", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "sendMessage", "Calzone", { instanceId: "8675309", } );
			} );
		} );

		describe( "when calling receiveMessage", () => {
			beforeEach( () => {
				fsmOptions.receiveMessage.call( machinaStub, { envelope: "ENVELOPE", } );
			} );

			it( "should tell the FSM to handle receiveMessage", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "receiveMessage", "ENVELOPE" );
			} );
		} );

		describe( "when calling disconnect", () => {
			beforeEach( () => {
				fsmOptions.disconnect.call( machinaStub );
			} );

			it( "should tell the FSM to handle disconnect", () => {
				machinaStub.handle.should.be.calledOnceWithExactly( "disconnect" );
			} );
		} );

		describe( "when calling send", () => {
			beforeEach( () => {
				fsmOptions.send.call( machinaStub, "PAYLOAD" );
			} );

			it( "should call postMessage on the target", () => {
				machinaStub.target.postMessage.should.be.calledOnceWithExactly( { externa: true, payload: "PAYLOAD", } );
			} );
		} );
	} );

	describe( "with state-specific behavior", () => {
		beforeEach( function() {
			this.clock = sinon.useFakeTimers( 1592067600000 ); // eslint-disable-line no-invalid-this
		} );

		afterEach( function () {
			this.clock.restore(); // eslint-disable-line no-invalid-this
		} );

		describe( "when in the uninitialized state", () => {
			describe( "when calling receivePing", () => {
				beforeEach( () => {
					fsmOptions.states.uninitialized.receivePing.call( machinaStub, { instanceId: "cannoli", } );
				} );

				it( "should set the instanceId", () => {
					machinaStub.instanceId.should.eql( "cannoli" );
				} );
			} );

			describe( "when calling sendPong", () => {
				beforeEach( () => {
					fsmOptions.states.uninitialized.sendPong.call( machinaStub );
				} );

				it( "should defer all other input until the ponging state", () => {
					machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ponging" );
				} );

				it( "should transition to the ponging state", () => {
					machinaStub.transition.should.be.calledOnceWithExactly( "ponging" );
				} );
			} );
		} );

		describe( "when in the pinging state", () => {
			describe( "when calling _onEnter", () => {
				beforeEach( () => {
					fsmOptions.states.pinging._onEnter.call( machinaStub );
				} );

				it( "should log that we are pinging", () => {
					machinaStub.logger.should.be.calledWithMatch( "pinging:" );
				} );

				it( "should send the ping payload", () => {
					machinaStub.send.should.be.calledWithMatch( {
						type: "externa.ping",
						timeStamp: sinon.match.date,
						ticket: "EweEweEyeDee",
						instanceId: "gelato",
					} );
				} );
			} );

			describe( "when calling receivePong", () => {
				beforeEach( () => {
					fsmOptions.states.pinging.receivePong.call( machinaStub, { instanceId: "darjeeling", } );
				} );

				it( "should set the instanceId and handshakeComplete properties", () => {
					machinaStub.should.containSubset( {
						instanceId: "darjeeling",
						handshakeComplete: true,
					} );
				} );

				it( "should log that we are completing a handshake", () => {
					machinaStub.logger.should.be.calledOnceWithExactly( "completed handshake with darjeeling" );
				} );

				it( "should transition to the connected state", () => {
					machinaStub.transition.should.be.calledOnceWithExactly( "connected" );
				} );
			} );

			describe( "when calling receivePing", () => {
				beforeEach( () => {
					fsmOptions.states.pinging.receivePing.call( machinaStub, { instanceId: "assam", } );
				} );

				it( "should set the instanceId", () => {
					machinaStub.instanceId.should.eql( "assam" );
				} );
			} );

			describe( "when calling sendPong", () => {
				beforeEach( () => {
					fsmOptions.states.pinging.sendPong.call( machinaStub );
				} );

				it( "should defer all other input until the ponging state", () => {
					machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "ponging" );
				} );

				it( "should transition to the ponging state", () => {
					machinaStub.transition.should.be.calledOnceWithExactly( "ponging" );
				} );
			} );

			describe( "when calling receiveMessage", () => {
				beforeEach( () => {
					fsmOptions.states.pinging.receiveMessage.call( machinaStub );
				} );

				it( "should defer all other input until the connected state", () => {
					machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "connected" );
				} );
			} );

			describe( "when calling sendMessage", () => {
				beforeEach( () => {
					fsmOptions.states.pinging.sendMessage.call( machinaStub );
				} );

				it( "should defer all other input until the connected state", () => {
					machinaStub.deferUntilTransition.should.be.calledOnceWithExactly( "connected" );
				} );
			} );
		} );

		describe( "when in the ponging state", () => {
			describe( "when calling sendPong", () => {
				beforeEach( () => {
					fsmOptions.states.ponging.sendPong.call( machinaStub, { instanceId: "golden hunan", } );
				} );

				it( "should log that we are ponging", () => {
					machinaStub.logger.should.be.calledWithMatch( "ponging:" );
				} );

				it( "should send the pong payload", () => {
					machinaStub.send.should.be.calledWithMatch( {
						type: "externa.pong",
						instanceId: "gelato",
						timeStamp: sinon.match.date,
						pingData: {
							instanceId: "golden hunan",
							timeStamp: undefined,
							ticket: undefined,
						},
					} );
				} );

				it( "should transition to the connected state", () => {
					machinaStub.transition.should.be.calledOnceWithExactly( "connected" );
				} );
			} );
		} );

		describe( "when in the connected state", () => {
			describe( "when calling receiveMessage", () => {
				describe( "when we do not have a handler", () => {
					beforeEach( () => {
						moduleInstance.setHandlers( {} );
						fsmOptions.states.connected.receiveMessage.call(
							machinaStub,
							{
								type: "Tea Order",
								message: { cupOf: "golden hunan", },
							}
						);
					} );

					it( "should log that we received a message", () => {
						machinaStub.logger.should.be.calledWithMatch( "received message from" );
					} );

					it( "should log that we have no handler for this message", () => {
						machinaStub.logger.should.be.calledWithMatch( "no user handler for:" );
					} );
				} );

				describe( "when we have a handler", () => {
					let handlerStub;

					beforeEach( () => {
						handlerStub = sinon.stub();
						moduleInstance.setHandlers( {
							"Tea Order": handlerStub,
						} );
						fsmOptions.states.connected.receiveMessage.call(
							machinaStub,
							{
								type: "Tea Order",
								message: { instanceId: "golden hunan", },
							}
						);
					} );

					it( "should log that we received a message", () => {
						machinaStub.logger.should.be.calledWithMatch( "received message from" );
					} );

					it( "should invoke the handler for this message", () => {
						handlerStub.should.be.calledOnceWithExactly( { instanceId: "golden hunan", } );
					} );
				} );
			} );

			describe( "when calling sendMessage", () => {
				beforeEach( () => {
					fsmOptions.states.connected.sendMessage.call( machinaStub, "Tea Order", { instanceId: "golden hunan", } );
				} );

				it( "should log that we are sending a message", () => {
					machinaStub.logger.should.be.calledWithMatch( "sending msg:" );
				} );

				it( "should send the message payload", () => {
					machinaStub.send.should.be.calledWithMatch( {
						type: "externa.message",
						instanceId: "gelato",
						timeStamp: sinon.match.date,
						envelope: { type: "Tea Order", message: { instanceId: "golden hunan", }, },
					} );
				} );
			} );
		} );

		describe( "when in the disconnected state", () => {
			describe( "when calling _onEnter", () => {
				beforeEach( () => {
					fsmOptions.states.disconnected._onEnter.call( machinaStub );
				} );

				it( "should log that we are disconnecting", () => {
					machinaStub.logger.should.be.calledWithMatch( "sending disconnect:" );
				} );

				it( "should send the disconnect payload", () => {
					machinaStub.send.should.be.calledWithMatch( {
						type: "externa.disconnect",
						timeStamp: sinon.match.date,
						instanceId: state.instanceId,
					} );
				} );
			} );
		} );
	} );
} );
