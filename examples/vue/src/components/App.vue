<template>
	<div>
		<div>Externa Sandbox</div>
		<div>
			<iframe src="iframe.html?instanceId=IFRAME_1" frameborder="1"></iframe>
		</div>
		<div>
			<iframe src="iframe.html?instanceId=IFRAME_2" frameborder="1"></iframe>
		</div>
	</div>
</template>

<script>
import Worker from "../web.worker.js";
import externa from "externa";
window.externa = externa;

export default {
	name: "App",
	mounted() {
		externa.init( {
			instanceId: "PARENT_WINDOW",
			handlers: {
				DESSERT_OPTIONS( msg ) {
					console.log( "Externa Message: (Dessert options)", msg );
				},
			},
		} );
		externa.connect();
		externa.sendMessage( "DINNER_OPTIONS", { cal: "zone", car: "bonara", } );
		const wrkr = new Worker();
		externa.connectWorker( wrkr );
		setTimeout( () => {
			console.log( "Disconnecting" );
			externa.disconnect();
		}, 7000 ); // eslint-disable-line
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
