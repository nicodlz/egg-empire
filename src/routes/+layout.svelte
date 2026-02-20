<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Egg Empire - Idle Game</title>
	<meta name="description" content="Build your chicken egg empire from humble beginnings to cosmic domination!" />
</svelte:head>

<div class="app-container">
	{@render children()}
</div>

<style>
	.app-container {
		min-height: 100vh;
		width: 100%;
	}
</style>
