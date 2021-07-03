import "core-js/stable";
import "regenerator-runtime/runtime";
import proxyFn from "proxyquire";
import chai from "chai";
import chaiSubset from "chai-subset";


chai.use( require( "dirty-chai" ) );
chai.use( require( "sinon-chai" ) );
chai.use( chaiSubset );
global.should = chai.should();
global.proxyquire = proxyFn.noPreserveCache().noCallThru();
global.machina = require( "machina" );
global.sinon = require( "sinon" );
