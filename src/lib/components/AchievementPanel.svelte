<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import type { AchievementManager } from '$lib/achievements/AchievementManager.svelte';

	interface Props {
		manager: AchievementManager;
		isOpen: boolean;
		onClose: () => void;
	}

	let { manager, isOpen = false, onClose }: Props = $props();

	let panelElement: HTMLDivElement;
	let overlayElement: HTMLDivElement;

	const allAchievements = manager.getAllAchievements();
	const progress = $derived(manager.getProgress());

	// Animate panel open/close
	$effect(() => {
		if (!panelElement || !overlayElement) return;

		if (isOpen) {
			// Show panel
			gsap.to(overlayElement, {
				opacity: 1,
				duration: 0.2,
				display: 'flex'
			});
			gsap.fromTo(
				panelElement,
				{ scale: 0.8, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
			);
		} else {
			// Hide panel
			gsap.to(panelElement, {
				scale: 0.8,
				opacity: 0,
				duration: 0.2
			});
			gsap.to(overlayElement, {
				opacity: 0,
				duration: 0.2,
				onComplete: () => {
					gsap.set(overlayElement, { display: 'none' });
				}
			});
		}
	});

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === overlayElement) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div 
		bind:this={overlayElement}
		class="achievement-overlay"
		onclick={handleOverlayClick}
		style="opacity: 0; display: none;"
	>
		<div 
			bind:this={panelElement}
			class="achievement-panel"
			style="opacity: 0; transform: scale(0.8);"
		>
			<div class="panel-header">
				<h2>🏆 Achievements</h2>
				<button class="close-btn" onclick={onClose}>✕</button>
			</div>

			<div class="progress-section">
				<div class="progress-text">
					{progress.unlocked} / {progress.total} ({Math.floor(progress.percentage)}%)
				</div>
				<div class="progress-bar">
					<div 
						class="progress-fill" 
						style="width: {progress.percentage}%"
					></div>
				</div>
			</div>

			<div class="achievements-grid">
				{#each allAchievements as achievement}
					{@const isUnlocked = manager.isUnlocked(achievement.id)}
					<div class="achievement-card" class:locked={!isUnlocked}>
						<div class="achievement-emoji">
							{isUnlocked ? achievement.emoji : '🔒'}
						</div>
						<div class="achievement-info">
							<div class="achievement-name">
								{isUnlocked ? achievement.name : '???'}
							</div>
							<div class="achievement-description">
								{isUnlocked ? achievement.description : 'Locked'}
							</div>
							{#if isUnlocked}
								<div class="achievement-reward">
									✨ {achievement.reward}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.achievement-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 20px;
	}

	.achievement-panel {
		background: linear-gradient(135deg, #2c1810 0%, #3d2817 100%);
		border: 4px solid #8b6914;
		border-radius: 16px;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 2px solid #8b6914;
	}

	.panel-header h2 {
		margin: 0;
		color: #ffd700;
		font-size: 28px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.close-btn {
		background: transparent;
		border: none;
		color: #ffd700;
		font-size: 32px;
		cursor: pointer;
		line-height: 1;
		padding: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: rgba(255, 215, 0, 0.1);
		transform: scale(1.1);
	}

	.progress-section {
		padding: 16px 24px;
		background: rgba(0, 0, 0, 0.2);
		border-bottom: 2px solid #8b6914;
	}

	.progress-text {
		color: #ffd700;
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 8px;
		text-align: center;
	}

	.progress-bar {
		height: 24px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		overflow: hidden;
		border: 2px solid #8b6914;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
		transition: width 0.5s ease;
		box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
	}

	.achievements-grid {
		padding: 24px;
		overflow-y: auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 16px;
	}

	.achievement-card {
		background: linear-gradient(135deg, #3d2817 0%, #4a3318 100%);
		border: 2px solid #8b6914;
		border-radius: 12px;
		padding: 16px;
		display: flex;
		gap: 12px;
		transition: all 0.2s;
	}

	.achievement-card:not(.locked):hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
		border-color: #ffd700;
	}

	.achievement-card.locked {
		opacity: 0.4;
		filter: grayscale(1);
	}

	.achievement-emoji {
		font-size: 48px;
		line-height: 1;
		flex-shrink: 0;
	}

	.achievement-info {
		flex: 1;
		min-width: 0;
	}

	.achievement-name {
		font-size: 18px;
		font-weight: bold;
		color: #ffd700;
		margin-bottom: 4px;
	}

	.achievement-description {
		font-size: 14px;
		color: #d4af37;
		margin-bottom: 8px;
		line-height: 1.4;
	}

	.achievement-reward {
		font-size: 13px;
		color: #90ee90;
		font-weight: 600;
		padding: 4px 8px;
		background: rgba(144, 238, 144, 0.1);
		border-radius: 6px;
		display: inline-block;
	}

	/* Scrollbar styling */
	.achievements-grid::-webkit-scrollbar {
		width: 8px;
	}

	.achievements-grid::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.achievements-grid::-webkit-scrollbar-thumb {
		background: #8b6914;
		border-radius: 4px;
	}

	.achievements-grid::-webkit-scrollbar-thumb:hover {
		background: #ffd700;
	}
</style>
