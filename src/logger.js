import debug from "debug";

let _logger = () => {};

export function setLogNamespace( namespace ) {
	_logger = debug( `externa:${ namespace }` );
}

export { _logger as logger };
