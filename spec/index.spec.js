
describe( "externa - main export", () => {
	let instance,
		postMessageListener,
		state,
		getExternals,
		newExternal2,
		ExternaRemoteProxy,
		sendPing,
		disconnect,
		sendMessage,
		setHandlers,
		init,
		pause,
		resume,
		getWindowAdapterFsm,
		setLogNamespace,
		origWarn,
		origErr,
		proxySpy,
		logger;

	beforeEach( () => {
		postMessageListener = sinon.stub();
		global.window.removeEventListener = sinon.stub();

		const knownExternal1 = { src: "external_1", };
		newExternal2 = { src: "external_2", };
		getExternals = sinon.stub().returns( [
			knownExternal1,
			newExternal2,
		] );
		const knownExternals = new Map();
		sendPing = sinon.stub();
		disconnect = sinon.stub();
		sendMessage = sinon.stub();
		knownExternals.set( knownExternal1, { sendPing, disconnect, sendMessage, } );
		state = {
			instanceId: "calzone",
			knownExternals,
		};

		setHandlers = sinon.stub();

		init = sinon.stub();
		pause = sinon.stub();
		resume = sinon.stub();
		getWindowAdapterFsm = sinon.stub().returns( {
			init,
			pause,
			resume,
		} );

		setLogNamespace = sinon.stub();
		logger = sinon.stub();

		ExternaRemoteProxy = function() {
			return { sendPing, };
		};
		proxySpy = sinon.spy( ExternaRemoteProxy );

		origWarn = console.warn;
		console.warn = sinon.stub();
		origErr = console.error;
		console.error = sinon.stub();
		instance = global.proxyquire( "../src/index.js", {
			"./inbound": { postMessageListener, },
			"./state": state,
			"./helpers": { getExternals, },
			"./ExternaRemoteProxy": { ExternaRemoteProxy: proxySpy, setHandlers, },
			"./windowAdapterFsm": { getWindowAdapterFsm, },
			"./logger": { setLogNamespace, logger, },
		} );
	} );

	afterEach( () => {
		console.warn = origWarn;
		console.error = origErr;
	} );

	it( "should export an object with the expected keys", () => {
		( typeof instance ).should.equal( "object" );
		instance.should.have.keys( [
			"knownExternals",
			"init",
			"connect",
			"connectWorker",
			"disconnect",
			"resumeUponCompletion",
			"sendMessage",
		] );
	} );

	describe( "when calling init", () => {
		describe( "with no instanceId and no handlers", () => {
			beforeEach( () => {
				instance.init( {} );
			} );

			it( "should use the instanceId from state as the log namespace", () => {
				setLogNamespace.should.be.calledOnceWithExactly( "calzone" );
			} );

			it( "should console.warn about missing user handlers", () => {
				console.warn.should.be.calledOnceWithExactly( "externa has not been configured with user handlers, so no inbound messages will be handled" );
			} );

			it( "should initialize the FSM that watches window (postMessage) for traffic", () => {
				getWindowAdapterFsm.should.be.calledOnce();
				init.should.be.calledOnce();
			} );
		} );

		describe( "with a custom instanceId & handlers", () => {
			beforeEach( () => {
				instance.init( {
					instanceId: "carbonara",
					handlers: { cal: "zone", },
				} );
			} );

			it( "should use the instanceId from state as the log namespace", () => {
				setLogNamespace.should.be.calledOnceWithExactly( "carbonara" );
			} );

			it( "should set the handlers (so that they'll be invoked on incoming messages)", () => {
				setHandlers.should.be.calledOnceWithExactly( { cal: "zone", } );
			} );

			it( "should initialize the FSM that watches window (postMessage) for traffic", () => {
				getWindowAdapterFsm.should.be.calledOnce();
				init.should.be.calledOnce();
			} );
		} );
	} );

	describe( "when calling connect", () => {
		beforeEach( () => {
			instance.connect();
		} );

		it( "log that it's connecting", () => {
			logger.should.be.calledOnceWithExactly( "connecting" );
		} );

		it( "should set up proxies for newly discovered externals", () => {
			proxySpy.should.be.calledOnce().and.calledWithNew();
			state.knownExternals.has( newExternal2 ).should.be.true();
		} );

		it( "should ping the external to start the handshake", () => {
			sendPing.should.be.calledTwice();
		} );
	} );

	describe( "when calling connectWorker", () => {
		it( "should log an error (not yet implemented)", () => {
			instance.connectWorker();
			console.error.should.be.calledOnceWithExactly( "Worker support has not been implemented yet" );
		} );
	} );

	describe( "when calling disconnect", () => {
		beforeEach( () => {
			instance.disconnect();
		} );

		it( "log that it's disconnecting", () => {
			logger.should.be.calledOnceWithExactly( "disconnecting" );
		} );

		it( "should remove the window message event listener", () => {
			global.window.removeEventListener.should.be.calledOnceWithExactly( "message", postMessageListener );
		} );

		it( "should call disconnect on the proxy", () => {
			disconnect.should.be.calledOnce();
		} );

		it( "should clear the list of knownExternals", () => {
			state.knownExternals.keys.length.should.equal( 0 );
		} );
	} );

	describe( "when calling resumeUponCompletion", () => {
		let unitOfWork,
			executed;

		beforeEach( async () => {
			unitOfWork = () => new Promise( resolve => {
				executed = true;
				resolve( "calzone time!" );
			} );
			await instance.resumeUponCompletion( unitOfWork );
		} );

		it( "should pause the window adapter FSM", () => {
			pause.should.be.calledOnce();
		} );

		it( "should execute the unit of work passed as the argument", () => {
			executed.should.be.true();
		} );

		it( "should resume the window adapter FSM", () => {
			resume.should.be.calledOnce();
		} );
	} );

	describe( "when calling sendMessage", () => {
		beforeEach( () => {
			instance.sendMessage( "carbonara", { pancetta: true, } );
		} );

		it( "should call sendMessage on the proxy", () => {
			sendMessage.should.be.calledOnceWithExactly( "carbonara", { pancetta: true, } );
		} );
	} );
} );
