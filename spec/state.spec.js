describe( "externa - state", () => {
	let moduleInstance,
		origGlobalWindow,
		createUUID;

	beforeEach( () => {
		createUUID = sinon.stub().returns( "CALZONES_FOR_ALL" );

		origGlobalWindow = global.window;
		global.window = {};
		global.window.parent = global.window;
	} );

	afterEach( () => {
		global.window = origGlobalWindow;
	} );

	describe( "when we are in a web worker", () => {
		let origLocation,
			origPostMessage;

		beforeEach( () => {
			global.window = undefined;
			origLocation = global.location;
			origPostMessage = global.postMessage;
			global.postMessage = () => {};
			global.location = {};

			moduleInstance = global.proxyquire( "../src/state.js", {
				"./helpers": { createUUID, },
			} );
		} );

		afterEach( () => {
			global.location = origLocation;
			global.postMessage = origPostMessage;
		} );

		it( "should return the expected state object", () => {
			moduleInstance.instanceId.should.eql( "CALZONES_FOR_ALL" );
			moduleInstance.isWorker.should.be.true();
			moduleInstance.knownExternals.should.be.an.instanceOf( Map );
		} );
	} );

	describe( "when we are in a window", () => {
		beforeEach( () => {
			moduleInstance = global.proxyquire( "../src/state.js", {
				"./helpers": { createUUID, },
			} );
		} );

		it( "should return the expected state object", () => {
			moduleInstance.instanceId.should.eql( "CALZONES_FOR_ALL" );
			moduleInstance.isWorker.should.be.false();
			moduleInstance.knownExternals.should.be.an.instanceOf( Map );
		} );
	} );
} );
