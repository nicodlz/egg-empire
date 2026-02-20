<script lang="ts">
	import { onMount } from 'svelte';
	import Decimal from 'break_eternity.js';
	import { GameEngine } from '$lib/engine/GameEngine';
	import { gameState } from '$lib/state/gameState.svelte';
	import { initializeUpgrades, updateGame, applyOfflineProgress } from '$lib/state/actions';
	import { getTotalEggsPerSecond, getCurrentPhaseProducers, getCurrentPhaseUpgrades, getShouldUnlockPhase } from '$lib/state/derived.svelte';
	
	import EggCounter from '$lib/components/EggCounter.svelte';
	import ResourceBar from '$lib/components/ResourceBar.svelte';
	import ProducerCard from '$lib/components/ProducerCard.svelte';
	import UpgradeButton from '$lib/components/UpgradeButton.svelte';
	import SellPanel from '$lib/components/SellPanel.svelte';
	import ChickenCoop from '$lib/components/ChickenCoop.svelte';
	import FactoryScene from '$lib/components/FactoryScene.svelte';
	import BiotechLab from '$lib/components/BiotechLab.svelte';
	import CosmicScene from '$lib/components/CosmicScene.svelte';
	import HatchAnimation from '$lib/components/HatchAnimation.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import { hatchEgg, buyAutoHatch, getAutoHatchCost } from '$lib/state/actions';
	import { playChicken } from '$lib/audio/chicken';
	import { formatNumber } from '$lib/engine/formulas';
	import AchievementToast from '$lib/components/AchievementToast.svelte';
	import AchievementPanel from '$lib/components/AchievementPanel.svelte';
	import { achievementManager, setAchievementCallback } from '$lib/achievements/achievementManager';
	import type { Achievement } from '$lib/achievements/achievements';

	let engine: GameEngine;
	let lastPhaseCheck = $state<string | null>(null);
	
	// Achievement system
	let showAchievementPanel = $state(false);
	let achievementQueue = $state<Achievement[]>([]);

	const producers = $derived(getCurrentPhaseProducers().filter((p: any) => p.id !== 'chicken'));
	const upgrades = $derived(getCurrentPhaseUpgrades());
	const chickenCount = $derived(gameState.producers.get('chicken')?.owned ?? 0);
	const eggsPerSec = $derived(getTotalEggsPerSecond().toNumber());
	const highestPhase = $derived.by(() => {
		if (gameState.phases.get('cosmic')?.unlocked) return 'cosmic';
		if (gameState.phases.get('biotech')?.unlocked) return 'biotech';
		if (gameState.phases.get('industrial')?.unlocked) return 'industrial';
		return 'artisanal';
	});
	
	let hatchCooldown = $state(false);
	let hatchAnim: HatchAnimation;

	const autoHatchCost = $derived(getAutoHatchCost());
	const canAffordAutoHatch = $derived(() => {
		const money = gameState.resources.get('money');
		return money ? money.canAfford(getAutoHatchCost()) : false;
	});

	async function handleHatch() {
		if (hatchCooldown) return;
		const eggs = gameState.resources.get('eggs');
		if (!eggs || !eggs.canAfford(new Decimal(1))) return;
		hatchCooldown = true;
		const success = hatchEgg();
		if (success) playChicken();
		await hatchAnim.hatch(success);
		hatchCooldown = false;
	}

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
	<AchievementToast achievements={achievementQueue} onClear={() => { achievementQueue = []; }} />

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
		<!-- Phase scene -->
		{#if highestPhase === 'cosmic'}
			<CosmicScene productionRate={eggsPerSec} />
		{:else if highestPhase === 'biotech'}
			<BiotechLab productionRate={eggsPerSec} />
		{:else if highestPhase === 'industrial'}
			<FactoryScene productionRate={eggsPerSec} />
		{/if}
		<ChickenCoop chickenCount={chickenCount} />

		<!-- Hatch + Auto-hatch row -->
		<div class="flex gap-2">
			<button
				class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all
					{hatchCooldown ? 'bg-gray-200 text-gray-400' : 'bg-amber-100/80 text-gray-900 active:scale-[0.98]'}"
				onclick={handleHatch}
				disabled={hatchCooldown}
				type="button"
			>
				<span class="text-xl">🥚</span>
				<span>Hatch</span>
				<span class="text-xs text-gray-400">(50%)</span>
				<HatchAnimation bind:this={hatchAnim} />
			</button>
			<button
				class="flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-all
					{canAffordAutoHatch() ? 'bg-green-100/80 text-green-800 active:scale-[0.98]' : 'bg-white/30 text-gray-400'}"
				onclick={() => buyAutoHatch()}
				disabled={!canAffordAutoHatch()}
				type="button"
			>
				<span class="text-lg">🤖</span>
				<div class="flex flex-col text-left">
					<span>Auto-Hatch</span>
					<span class="text-[10px] opacity-70">×{gameState.autoHatchCount} — {formatNumber(autoHatchCost)} 💰</span>
				</div>
			</button>
		</div>

		<!-- Sell section -->
		<SellPanel />

		<!-- Producers & upgrades -->
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
		top: 8px;
		right: 12px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: transparent;
		border: none;
		font-size: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
		z-index: 100;
	}

	.achievement-btn:active {
		transform: scale(0.9);
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
