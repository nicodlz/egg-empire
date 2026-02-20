<script lang="ts">
	import { gsap } from 'gsap';
	import confetti from 'canvas-confetti';

	let visible = $state(false);
	let resultEmoji = $state('');
	let containerElement: HTMLDivElement;
	let emojiElement: HTMLSpanElement;

	let resolveAnimation: (() => void) | null = null;

	export function hatch(success: boolean): Promise<void> {
		return new Promise<void>((resolve) => {
			visible = true;
			resultEmoji = success ? '🐔' : '💨';
			resolveAnimation = resolve;

			requestAnimationFrame(() => {
				const tl = gsap.timeline({
					onComplete: () => {
						visible = false;
						resolveAnimation?.();
						resolveAnimation = null;
					}
				});

				if (success) {
					tl.fromTo(emojiElement,
						{ scale: 0, rotation: -20 },
						{ scale: 1.3, rotation: 0, duration: 0.25, ease: 'back.out(2)' }
					).to(emojiElement, {
						scale: 1, duration: 0.15, ease: 'power2.out'
					}).to(emojiElement, {
						opacity: 0, y: -20, duration: 0.4, ease: 'power2.in'
					});

					// small confetti burst
					tl.call(() => {
						confetti({
							particleCount: 15,
							spread: 50,
							origin: { y: 0.7 },
							colors: ['#FFD700', '#FF8C42'],
							scalar: 0.6,
							gravity: 1.5,
							ticks: 60
						});
					}, [], 0.2);
				} else {
					tl.fromTo(emojiElement,
						{ scale: 0.5, opacity: 0.5 },
						{ scale: 1, opacity: 0.6, duration: 0.15 }
					).to(emojiElement, {
						opacity: 0, y: -15, duration: 0.35, ease: 'power2.in'
					});
				}
			});
		});
	}
</script>

{#if visible}
<div bind:this={containerElement} class="pointer-events-none inline-flex items-center justify-center w-8">
	<span bind:this={emojiElement} class="text-2xl">{resultEmoji}</span>
</div>
{/if}
