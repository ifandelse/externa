describe( "externa - state", () => {
	let moduleInstance,
		origGlobalWindow,
		createUUID;

	beforeEach( () => {
		createUUID = sinon.stub().returns( "CALZONES_FOR_ALL" );

		origGlobalWindow = global.window;
		global.window = {};
		global.window.parent = global.window;

		moduleInstance = global.proxyquire( "../src/state.js", {
			"./helpers": { createUUID, },
		} );
	} );

	afterEach( () => {
		global.window = origGlobalWindow;
	} );

	it( "should return the expected (default) state object", () => {
		moduleInstance.instanceId.should.eql( "CALZONES_FOR_ALL" );
		moduleInstance.isWorker.should.be.false();
		moduleInstance.knownExternals.should.be.an.instanceOf( Map );
	} );
} );
