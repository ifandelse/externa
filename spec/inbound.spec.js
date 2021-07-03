describe( "externa - inbound", () => {
	let postMessageListener,
		state,
		ExternaRemoteProxy,
		proxySpy,
		handleMessage,
		getWindowAdapterFsm,
		knownExternal1,
		knownRemote1,
		logger;

	beforeEach( () => {
		knownExternal1 = { src: "someIframe.html", };
		knownRemote1 = { proxyFsmInstance: true, };
		const knownExternals = new Map();
		knownExternals.set( knownExternal1, knownRemote1 );
		state = { knownExternals, };
		ExternaRemoteProxy = function() {
			return { fakeProxy: true, };
		};
		proxySpy = sinon.spy( ExternaRemoteProxy );
		handleMessage = sinon.stub();
		getWindowAdapterFsm = sinon.stub().returns( {
			handleMessage,
		} );
		logger = sinon.stub();

		const instance = global.proxyquire( "../src/inbound.js", {
			"./state": state,
			"./ExternaRemoteProxy": { ExternaRemoteProxy: proxySpy, },
			"./windowAdapterFsm": { getWindowAdapterFsm, },
			"./logger": { logger, },
		} );
		postMessageListener = instance.postMessageListener;
	} );

	describe( "when the message is not an externa message", () => {
		beforeEach( () => {
			postMessageListener( {
				data: {
					totallyNotExterna: true,
				},
			} );
		} );

		it( "should not ask the window adapter FSM to handle the message", () => {
			handleMessage.should.not.be.called();
		} );
	} );

	describe( "when the message is an externa message", () => {
		describe( "when the remote is not a knownExternal", () => {
			let source;

			beforeEach( () => {
				source = { src: "some-other-iframe", };
				postMessageListener( {
					data: {
						externa: true,
						payload: { cal: "zone", instanceId: "lunch", type: "tastyfood", },
					},
					source,
				} );
			} );

			it( "should log that we've received a message from an unknown source", () => {
				logger.should.be.calledOnceWithExactly( "received externa message from unknown source: lunch" );
			} );

			it( "should instantiate an ExternaRemoteProxy", () => {
				proxySpy.should.be.calledOnceWithExactly( {}, source, "lunch" ).and.calledWithNew();
			} );

			it( "should add the external to the knownExternals Map", () => {
				state.knownExternals.has( source ).should.be.true();
			} );

			it( "should handle the message", () => {
				handleMessage.should.be.calledOnceWithExactly(
					"tastyfood",
					{
						data: {
							cal: "zone",
							instanceId: "lunch",
							type: "tastyfood",
						},
						remote: { fakeProxy: true, },
					}
				);
			} );
		} );

		describe( "when the remote is a knownExternal", () => {
			beforeEach( () => {
				postMessageListener( {
					data: {
						externa: true,
						payload: { cal: "zone", instanceId: "lunch", type: "tastyfood", },
					},
					source: knownExternal1,
				} );
			} );

			it( "should not instantiate an ExternaRemoteProxy", () => {
				proxySpy.should.not.be.called();
			} );

			it( "should handle the message", () => {
				handleMessage.should.be.calledOnceWithExactly(
					"tastyfood",
					{
						data: {
							cal: "zone",
							instanceId: "lunch",
							type: "tastyfood",
						},
						remote: knownRemote1,
					}
				);
			} );
		} );
	} );
} );
