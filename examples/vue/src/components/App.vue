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
import externa from "externa";
window.externa = externa;

export default {
	name: "App",
	mounted() {
		externa.init( { instanceId: "PARENT_WINDOW", } );
		externa.connect();
		externa.sendMessage( "TESTY_TEST_TEST", { cal: "zone", car: "bonara", } );
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
