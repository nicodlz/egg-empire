<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import confetti from 'canvas-confetti';

	interface Props {
		phaseName: string;
		onComplete: () => void;
	}

	let { phaseName, onComplete }: Props = $props();
	let overlayElement: HTMLDivElement;
	let titleElement: HTMLHeadingElement;
	let phaseElement: HTMLHeadingElement;

	onMount(() => {
		// GSAP entrance animation
		const tl = gsap.timeline({
			onComplete: () => {
				// Exit animation
				gsap.to(overlayElement, {
					opacity: 0,
					scale: 1.2,
					duration: 0.5,
					ease: 'power2.in',
					onComplete
				});
			}
		});

		tl.fromTo(overlayElement,
			{ opacity: 0, scale: 0.8 },
			{ opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' }
		)
		.fromTo(titleElement,
			{ y: -50, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.4, ease: 'back.out' },
			'-=0.2'
		)
		.fromTo(phaseElement,
			{ scale: 0, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
			'-=0.2'
		);

		// Confetti celebration
		const duration = 3000;
		const animationEnd = Date.now() + duration;
		
		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) {
				clearInterval(interval);
				return;
			}

			confetti({
				particleCount: 2,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ['#FFD700', '#FF8C42', '#FF6B35']
			});
			
			confetti({
				particleCount: 2,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ['#FFD700', '#FF8C42', '#FF6B35']
			});
		}, 50);
	});
</script>

<div 
	bind:this={overlayElement}
	class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-amber-400/95 to-orange-500/95"
>
	<div class="text-center text-white">
		<h1 bind:this={titleElement} class="mb-4 text-4xl font-bold drop-shadow-lg sm:text-5xl">
			Phase Unlocked!
		</h1>
		<h2 bind:this={phaseElement} class="mb-6 text-5xl font-bold drop-shadow-xl sm:text-7xl">
			{phaseName}
		</h2>
		<div class="text-6xl sm:text-8xl">🎉</div>
	</div>
</div>
