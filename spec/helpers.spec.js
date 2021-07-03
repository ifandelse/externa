describe( "externa - inbound", () => {
	let moduleInstance,
		origGlobalDoc,
		origGlobalWindow,
		state;

	beforeEach( () => {
		state = {};

		origGlobalDoc = global.document;
		origGlobalWindow = global.window;

		global.document = {
			getElementsByTagName: sinon.stub().returns( [
				{ contentWindow: "ContentWindow1", },
				{ contentWindow: "ContentWindow2", },
				{ contentWindow: "ContentWindow3", },
			] ),
		};

		global.window = {};
		global.window.parent = global.window;

		moduleInstance = global.proxyquire( "../src/helpers.js", {
			"./state": state,
		} );
	} );

	afterEach( () => {
		global.document = origGlobalDoc;
		global.window = origGlobalWindow;
	} );

	describe( "when calling createUUID", () => {
		let values;

		beforeEach( () => {
			values = new Set();
			for ( let i = 0; i < 10000; i++ ) {
				values.add( moduleInstance.createUUID() );
			}
		} );

		it( "should return a reasonably unique identifier", () => {
			values.size.should.equal( 10000 );
		} );
	} );

	describe( "when calling getExternals", () => {
		let result;

		describe( "when isWorker is true", () => {
			let fakeWorkerContext;

			beforeEach( () => {
				state.isWorker = true;
				fakeWorkerContext = { worker: true, };
				result = moduleInstance.getExternals.call( fakeWorkerContext );
			} );

			it( "should return an array", () => {
				result.should.be.an.instanceof( Array );
				result.should.eql( [ fakeWorkerContext, ] );
			} );

			it( "should not search the document for iframes", () => {
				global.document.getElementsByTagName.should.not.be.called();
			} );
		} );

		describe( "when isWorker is false", () => {
			describe( "when we're in a parent window", () => {
				beforeEach( () => {
					state.isWorker = false;
					result = moduleInstance.getExternals();
				} );

				it( "should return an array", () => {
					result.should.be.an.instanceof( Array );
					result.should.eql( [
						"ContentWindow1",
						"ContentWindow2",
						"ContentWindow3",
					] );
				} );

				it( "should search the document for iframes", () => {
					global.document.getElementsByTagName.should.be.calledOnceWithExactly( "iframe" );
				} );

				it( "should not add the window.parent to the array", () => {
					result.length.should.equal( 3 );
				} );
			} );

			describe( "when the parent window prop is falsy", () => {
				beforeEach( () => {
					state.isWorker = false;
					global.window.parent = undefined;
					result = moduleInstance.getExternals();
				} );

				it( "should return an array", () => {
					result.should.be.an.instanceof( Array );
					result.should.eql( [
						"ContentWindow1",
						"ContentWindow2",
						"ContentWindow3",
					] );
				} );

				it( "should search the document for iframes", () => {
					global.document.getElementsByTagName.should.be.calledOnceWithExactly( "iframe" );
				} );

				it( "should not add the window.parent to the array", () => {
					result.length.should.equal( 3 );
				} );
			} );

			describe( "when we're in an iframe", () => {
				beforeEach( () => {
					state.isWorker = false;
					global.window.parent = "ParentWindow";
					result = moduleInstance.getExternals();
				} );

				it( "should return an array", () => {
					result.should.be.an.instanceof( Array );
					result.should.eql( [
						"ContentWindow1",
						"ContentWindow2",
						"ContentWindow3",
						"ParentWindow",
					] );
				} );

				it( "should search the document for iframes", () => {
					global.document.getElementsByTagName.should.be.calledOnceWithExactly( "iframe" );
				} );

				it( "should not add the window.parent to the array", () => {
					result.length.should.equal( 4 );
				} );
			} );
		} );
	} );
} );
