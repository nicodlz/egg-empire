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
	<!-- Top resource bar -->
	<ResourceBar />

	<!-- Main game area -->
	<div class="game-content">
		<!-- Left column: Egg clicker -->
		<div class="left-column">
			<EggCounter />
			<ProgressBar />
		</div>

		<!-- Right column: Producers and upgrades -->
		<div class="right-column">
			<!-- Producers section -->
			<section class="section">
				<h2 class="section-title">Producers</h2>
				<div class="producers-grid">
					{#each producers as producer (producer.id)}
						<ProducerCard {producer} />
					{/each}
				</div>
			</section>

			<!-- Upgrades section -->
			{#if upgrades.length > 0}
				<section class="section">
					<h2 class="section-title">Upgrades</h2>
					<div class="upgrades-grid">
						{#each upgrades as upgrade (upgrade.id)}
							<UpgradeButton {upgrade} />
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</div>

	<!-- Stats panel -->
	<StatsPanel />

	<!-- Phase transition overlay -->
	{#if showPhaseTransition}
		<PhaseTransition 
			phaseName={transitionPhaseName}
			onComplete={handlePhaseTransitionComplete}
		/>
	{/if}
</div>

<style>
	.game-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
	}

	.game-content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		background: rgba(255, 255, 255, 0.5);
		padding: 1.5rem;
		border-radius: 16px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		margin-bottom: 1rem;
		text-align: center;
	}

	.producers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.upgrades-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.75rem;
	}

	@media (max-width: 1024px) {
		.game-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 1rem;
		}

		.left-column {
			position: static;
		}

		.producers-grid {
			grid-template-columns: 1fr;
		}

		.upgrades-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.game-content {
			padding: 0.75rem;
			gap: 1rem;
		}

		.section {
			padding: 1rem;
		}

		.section-title {
			font-size: 1.25rem;
		}
	}
</style>
