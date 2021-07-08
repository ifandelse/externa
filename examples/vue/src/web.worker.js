console.log( "INIT-ING worker" );

import externa from "externa";
externa.init( { instanceId: "WEB_WORKER_1a", isWorker: true, } );
externa.connect();
externa.sendMessage(
	"DESSERT_OPTIONS", {
		cheese: "cake",
		gel: "ato",
	}
);
