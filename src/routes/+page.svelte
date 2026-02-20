<script lang="ts">
	import { onMount } from 'svelte';
	import { GameEngine } from '$lib/engine/GameEngine';
	import { gameState } from '$lib/state/gameState.svelte';
	import { initializeUpgrades, updateGame, applyOfflineProgress } from '$lib/state/actions';
	import { getTotalEggsPerSecond, getCurrentPhaseProducers, getCurrentPhaseUpgrades, getShouldUnlockPhase } from '$lib/state/derived.svelte';
	
	import EggCounter from '$lib/components/EggCounter.svelte';
	import ResourceBar from '$lib/components/ResourceBar.svelte';
	import ProducerCard from '$lib/components/ProducerCard.svelte';
	import UpgradeButton from '$lib/components/UpgradeButton.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import PhaseTransition from '$lib/components/PhaseTransition.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';

	let engine: GameEngine;
	let showPhaseTransition = $state(false);
	let transitionPhaseName = $state('');
	let lastPhaseCheck = $state<string | null>(null);

	const producers = $derived(getCurrentPhaseProducers());
	const upgrades = $derived(getCurrentPhaseUpgrades());

	// Watch for phase unlocks
	$effect(() => {
		const phaseToUnlock = getShouldUnlockPhase();
		if (phaseToUnlock && phaseToUnlock !== lastPhaseCheck) {
			const phase = gameState.phases.get(phaseToUnlock);
			if (phase) {
				transitionPhaseName = phase.name;
				showPhaseTransition = true;
				lastPhaseCheck = phaseToUnlock;
			}
		}
	});

	function handlePhaseTransitionComplete() {
		showPhaseTransition = false;
	}

	onMount(() => {
		// Initialize upgrades with their effects
		initializeUpgrades();

		// Create game engine
		engine = new GameEngine(gameState, updateGame);

		// Try to load saved game
		const loaded = engine.load();

		if (loaded) {
			// Calculate offline progress
			const offlineTime = engine.getOfflineTime();
			if (offlineTime > 1000) {
				const offlineSeconds = offlineTime / 1000;
				const cappedSeconds = Math.min(offlineSeconds, 86400); // Max 24h
				applyOfflineProgress(cappedSeconds, getTotalEggsPerSecond());
				
				console.log(`Welcome back! You were offline for ${(offlineSeconds / 60).toFixed(1)} minutes`);
			}
		}

		// Start the game loop
		engine.start();

		// Cleanup on unmount
		return () => {
			engine.stop();
			engine.save();
		};
	});
</script>

<div class="game-container game-ui">
	<!-- Phase transition overlay -->
	{#if showPhaseTransition}
		<PhaseTransition 
			phaseName={transitionPhaseName}
			onComplete={handlePhaseTransitionComplete}
		/>
	{/if}

	<!-- Top: compact resource bar -->
	<ResourceBar />

	<!-- Middle: scrollable content -->
	<div class="scroll-area">
		<div class="item-list">
			{#each producers as producer (producer.id)}
				<ProducerCard {producer} />
			{/each}
			{#each upgrades as upgrade (upgrade.id)}
				<UpgradeButton {upgrade} />
			{/each}
		</div>
	</div>

	<!-- Bottom: egg clicker (fixed) -->
	<div class="egg-dock">
		<EggCounter />
	</div>

	<!-- Stats panel -->
	<StatsPanel />
</div>

<style>
	.game-container {
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background: linear-gradient(180deg, #FFF8E7 0%, #F5E6D3 100%);
		overflow: hidden;
	}

	.scroll-area {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		-webkit-overflow-scrolling: touch;
	}

	.egg-dock {
		flex-shrink: 0;
		padding: 0.5rem 0;
	}

	.item-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Desktop */
	@media (min-width: 1024px) {
		.scroll-area {
			padding: 1.5rem;
			max-width: 500px;
			margin: 0 auto;
			width: 100%;
		}

		.egg-dock {
			padding: 1rem 0;
		}
	}
</style>
