<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { formatNumber } from '../engine/formulas';
	import { gameState } from '../state/gameState.svelte';
	import { clickEgg } from '../state/actions';
	import { playTap } from '../audio/tap';
	import confetti from 'canvas-confetti';
	import FloatingText from './FloatingText.svelte';

	let eggElement: HTMLDivElement;
	let emojiElement: HTMLDivElement;
	let counterElement: HTMLDivElement;
	let floatingText: FloatingText;

	const eggs = $derived(gameState.resources.get('eggs'));

	function handleClick(event: MouseEvent | TouchEvent) {
		clickEgg();
		playTap();

		// Spawn floating text with current click power
		const clickPowerValue = gameState.clickPower.toNumber();
		floatingText?.spawn(`+${formatNumber(clickPowerValue)}`);

		// Get click position for confetti
		const rect = eggElement.getBoundingClientRect();
		let clientX: number, clientY: number;
		if ('touches' in event) {
			clientX = event.changedTouches[0].clientX;
			clientY = event.changedTouches[0].clientY;
		} else {
			clientX = event.clientX;
			clientY = event.clientY;
		}

		// Confetti burst from tap point
		confetti({
			particleCount: 5,
			spread: 50,
			startVelocity: 20,
			origin: { 
				x: clientX / window.innerWidth, 
				y: clientY / window.innerHeight 
			},
			colors: ['#FFD700', '#FF8C42', '#FFF8E7'],
			scalar: 0.7,
			gravity: 1.5,
			ticks: 80
		});

		// Kill any running tween first for snappy feel
		gsap.killTweensOf(emojiElement);

		// Squash & stretch — egg squishes down then bounces up
		gsap.timeline()
			.to(emojiElement, {
				scaleX: 1.15,
				scaleY: 0.85,
				duration: 0.06,
				ease: 'power2.in'
			})
			.to(emojiElement, {
				scaleX: 0.9,
				scaleY: 1.2,
				duration: 0.08,
				ease: 'power2.out'
			})
			.to(emojiElement, {
				scaleX: 1,
				scaleY: 1,
				duration: 0.15,
				ease: 'elastic.out(1, 0.4)'
			});

		// Quick counter bump
		gsap.fromTo(counterElement,
			{ scale: 1 },
			{ scale: 1.15, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }
		);

		// Random small rotation wiggle
		const wiggle = (Math.random() - 0.5) * 8;
		gsap.timeline()
			.to(emojiElement, { rotation: wiggle, duration: 0.05 })
			.to(emojiElement, { rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' });
	}
</script>

<div class="relative flex flex-col items-center justify-center pb-4 pt-2" bind:this={eggElement}>
	<FloatingText bind:this={floatingText} />
	<button 
		class="flex flex-col items-center justify-center bg-transparent border-none outline-none cursor-pointer"
		onclick={handleClick}
		type="button"
	>
		<div bind:this={emojiElement} class="text-8xl drop-shadow-lg sm:text-9xl select-none will-change-transform">🥚</div>
		<div bind:this={counterElement} class="big-number mt-3 text-2xl font-bold text-sunset-orange sm:text-3xl will-change-transform">
			{eggs ? formatNumber(eggs.amount) : '0'}
		</div>
		<div class="mt-1 text-xs uppercase tracking-wider text-gray-500">Eggs</div>
	</button>
</div>
