import { createUUID } from "./helpers";

export default {
	instanceId: createUUID(),
	isWorker: false,
	knownExternals: new Map(),
};


