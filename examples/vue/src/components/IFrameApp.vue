<template>
	<div>Externa Iframe</div>
</template>

<script>
import queryString from "query-string";
import externa from "externa";
window.externa = externa;

export default {
	name: "IFrameApp",
	mounted() {
		const qs = queryString.parse( window.location.search );
		externa.init( {
			instanceId: qs.instanceId || "IFRAME",
			handlers: {
				DINNER_OPTIONS( msg ) {
					console.log( "Externa Message (Dinner options):", msg );
				},
			},
		} );
		externa.connect();
	},
};
</script>

<style>
#iframe-app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
