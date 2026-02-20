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
	// PhaseTransition removed — using subtle toast instead
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import AchievementToast from '$lib/components/AchievementToast.svelte';
	import AchievementPanel from '$lib/components/AchievementPanel.svelte';
	import { achievementManager, setAchievementCallback } from '$lib/achievements/achievementManager';
	import type { Achievement } from '$lib/achievements/achievements';

	let engine: GameEngine;
	let lastPhaseCheck = $state<string | null>(null);
	
	// Achievement system
	let showAchievementPanel = $state(false);
	let achievementQueue = $state<Achievement[]>([]);

	const producers = $derived(getCurrentPhaseProducers());
	const upgrades = $derived(getCurrentPhaseUpgrades());

	// Watch for phase unlocks — subtle notification instead of fullscreen
	let phaseToast = $state('');
	let phaseToastVisible = $state(false);

	$effect(() => {
		const phaseToUnlock = getShouldUnlockPhase();
		if (phaseToUnlock && phaseToUnlock !== lastPhaseCheck) {
			const phase = gameState.phases.get(phaseToUnlock);
			if (phase) {
				lastPhaseCheck = phaseToUnlock;
				phaseToast = `🎉 ${phase.name} unlocked!`;
				phaseToastVisible = true;
				setTimeout(() => { phaseToastVisible = false; }, 3000);
			}
		}
	});

	onMount(() => {
		// Set up achievement callback
		setAchievementCallback((newAchievements) => {
			if (newAchievements.length > 0) {
				achievementQueue = [...achievementQueue, ...newAchievements];
			}
		});

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
	<!-- Achievement toast -->
	<AchievementToast achievements={achievementQueue} />

	<!-- Achievement panel -->
	<AchievementPanel 
		manager={achievementManager}
		isOpen={showAchievementPanel}
		onClose={() => showAchievementPanel = false}
	/>

	<!-- Phase transition overlay -->
	{#if phaseToastVisible}
		<div class="fixed top-12 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg backdrop-blur-sm transition-all">
			{phaseToast}
		</div>
	{/if}

	<!-- Achievement button -->
	<button class="achievement-btn" onclick={() => showAchievementPanel = true}>
		🏆
	</button>

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
		position: relative;
	}

	.achievement-btn {
		position: fixed;
		top: 20px;
		right: 20px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		border: 3px solid #f4a460;
		font-size: 32px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 0 20px rgba(255, 215, 0, 0.3);
		transition: all 0.2s;
		z-index: 100;
	}

	.achievement-btn:hover {
		transform: scale(1.1) rotate(5deg);
		box-shadow: 
			0 6px 16px rgba(0, 0, 0, 0.4),
			0 0 30px rgba(255, 215, 0, 0.5);
	}

	.achievement-btn:active {
		transform: scale(0.95);
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
