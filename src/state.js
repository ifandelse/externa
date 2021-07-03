import { createUUID } from "./helpers";

export default {
	instanceId: createUUID(),
	isWorker: ( typeof window === "undefined" ) && !!postMessage && !!location,
	knownExternals: new Map(),
};


