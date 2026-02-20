<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import type { Achievement } from '$lib/achievements/achievements';

	interface Props {
		achievements: Achievement[];
	}

	let { achievements = [] }: Props = $props();

	let currentIndex = $state(0);
	let currentAchievement = $derived(achievements[currentIndex]);
	let toastElement: HTMLDivElement;
	let isAnimating = $state(false);

	// Show next achievement in queue
	function showNext() {
		if (!currentAchievement || isAnimating) return;

		isAnimating = true;

		// Slide in from top
		gsap.fromTo(
			toastElement,
			{
				y: -100,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'back.out(1.7)',
				onComplete: () => {
					// Stay visible for 2 seconds
					gsap.to(toastElement, {
						delay: 2,
						y: -100,
						opacity: 0,
						duration: 0.3,
						ease: 'power2.in',
						onComplete: () => {
							isAnimating = false;
							// Move to next achievement
							if (currentIndex < achievements.length - 1) {
								currentIndex++;
								showNext();
							} else {
								// Reset queue
								currentIndex = 0;
							}
						}
					});
				}
			}
		);
	}

	// Watch for new achievements
	$effect(() => {
		if (achievements.length > 0 && !isAnimating) {
			showNext();
		}
	});
</script>

{#if currentAchievement}
	<div 
		bind:this={toastElement}
		class="achievement-toast"
		style="opacity: 0; transform: translateY(-100px);"
	>
		<div class="toast-content">
			<span class="toast-emoji">{currentAchievement.emoji}</span>
			<div class="toast-text">
				<div class="toast-title">Achievement Unlocked!</div>
				<div class="toast-name">{currentAchievement.name}</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.achievement-toast {
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		pointer-events: none;
	}

	.toast-content {
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		border: 3px solid #f4a460;
		border-radius: 12px;
		padding: 16px 24px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 0 20px rgba(255, 215, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		min-width: 300px;
	}

	.toast-emoji {
		font-size: 48px;
		line-height: 1;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.toast-text {
		flex: 1;
	}

	.toast-title {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		color: #8b4513;
		letter-spacing: 0.5px;
		margin-bottom: 2px;
	}

	.toast-name {
		font-size: 18px;
		font-weight: bold;
		color: #654321;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
	}
</style>
