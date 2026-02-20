<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { formatNumber } from '../engine/formulas';
	import { gameState } from '../state/gameState.svelte';
	import { clickEgg } from '../state/actions';
	import confetti from 'canvas-confetti';

	let displayValue = $state(0);
	let eggElement: HTMLDivElement;

	const eggs = $derived(gameState.resources.get('eggs'));
	const actualValue = $derived(eggs?.amount.toNumber() ?? 0);

	// GSAP counter animation
	$effect(() => {
		if (actualValue !== displayValue) {
			gsap.to({ value: displayValue }, {
				value: actualValue,
				duration: 0.5,
				ease: 'power2.out',
				onUpdate: function() {
					displayValue = this.targets()[0].value;
				}
			});
		}
	});

	function handleClick(event: MouseEvent) {
		clickEgg();

		// Confetti at click position
		const rect = eggElement.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		confetti({
			particleCount: 3,
			spread: 40,
			startVelocity: 15,
			origin: { x, y },
			colors: ['#FFD700', '#FF8C42'],
			scalar: 0.6,
			gravity: 1.2,
			ticks: 100
		});

		// GSAP bounce animation
		gsap.fromTo(eggElement,
			{ scale: 1 },
			{ 
				scale: 1.1, 
				duration: 0.1,
				yoyo: true,
				repeat: 1,
				ease: 'back.inOut'
			}
		);
	}
</script>

<div class="flex justify-center p-8" bind:this={eggElement}>
	<button 
		class="flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-amber-400 bg-gradient-to-br from-egg-cream to-egg-shell shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 active:translate-y-0 sm:h-52 sm:w-52"
		onclick={handleClick}
		type="button"
	>
		<div class="text-6xl drop-shadow-md sm:text-7xl">🥚</div>
		<div class="big-number mt-2 text-2xl font-bold text-sunset-orange sm:text-3xl">
			{eggs ? formatNumber(eggs.amount) : '0'}
		</div>
		<div class="mt-1 text-xs uppercase tracking-wider text-gray-600">Eggs</div>
	</button>
</div>
