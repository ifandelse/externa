describe( "externa - logger", () => {
	let moduleInstance,
		loggerStub,
		debug;

	beforeEach( () => {
		loggerStub = sinon.stub();
		debug = sinon.stub().returns( loggerStub );

		moduleInstance = global.proxyquire( "../src/logger.js", {
			debug,
		} );
	} );

	describe( "when setting the logging namespace", () => {
		beforeEach( () => {
			moduleInstance.setLogNamespace( "cheesecake" );
		} );

		it( "should allow setting the logging namespace", () => {
			debug.should.be.calledWithExactly( "externa:cheesecake" );
		} );

		it( "should export the logger", () => {
			moduleInstance.logger( "goes best with hot tea" );
			loggerStub.should.be.calledWithExactly( "goes best with hot tea" );
		} );
	} );

	describe( "when the log namespace has not been set", () => {
		it( "should not actually log anything via debug", () => {
			moduleInstance.logger( "goes best with hot tea" );
			loggerStub.should.not.be.called();
		} );
	} );
} );
