<script lang="ts">
	import { gsap } from 'gsap';
	import confetti from 'canvas-confetti';

	let visible = $state(false);
	let isSuccess = $state(false);
	let eggElement: HTMLDivElement;
	let cracksElement: HTMLDivElement;
	let resultElement: HTMLDivElement;
	let overlayElement: HTMLDivElement;

	let resolveAnimation: (() => void) | null = null;

	/**
	 * Lance l'animation d'éclosion
	 * @param success - true si l'éclosion réussit (🐔), false sinon (💨)
	 * @returns Promise qui se résout quand l'animation est terminée
	 */
	export function hatch(success: boolean): Promise<void> {
		return new Promise<void>((resolve) => {
			visible = true;
			isSuccess = success;
			resolveAnimation = resolve;

			// Attendre le prochain tick pour que les éléments soient dans le DOM
			requestAnimationFrame(() => {
				playHatchAnimation(success);
			});
		});
	}

	function playHatchAnimation(success: boolean): void {
		const tl = gsap.timeline({
			onComplete: () => {
				// Nettoyer et résoudre la promise
				visible = false;
				if (resolveAnimation) {
					resolveAnimation();
					resolveAnimation = null;
				}
			}
		});

		// 1. L'œuf apparaît au centre (fade in + scale)
		tl.fromTo(
			overlayElement,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.2, ease: 'power2.out' }
		).fromTo(
			eggElement,
			{ scale: 0, opacity: 0, rotation: -15 },
			{ scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(1.7)' },
			'-=0.1'
		);

		// 2. L'œuf tremble (wiggle)
		tl.to(eggElement, {
			rotation: 10,
			x: -5,
			duration: 0.08,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: 5
		});

		// 3. Les cracks apparaissent
		tl.fromTo(
			cracksElement,
			{ scale: 0, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.15, ease: 'power2.out' }
		);

		// 4. L'œuf tremble encore plus fort
		tl.to(eggElement, {
			rotation: -15,
			x: 8,
			duration: 0.06,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: 7
		});

		if (success) {
			// 5a. SUCCESS : L'œuf disparaît, le poulet apparaît
			tl.to(eggElement, {
				scale: 0,
				opacity: 0,
				duration: 0.2,
				ease: 'power2.in'
			})
				.to(
					cracksElement,
					{
						scale: 0,
						opacity: 0,
						duration: 0.2,
						ease: 'power2.in'
					},
					'<'
				)
				.fromTo(
					resultElement,
					{ scale: 0, opacity: 0, y: 20 },
					{
						scale: 1,
						opacity: 1,
						y: 0,
						duration: 0.3,
						ease: 'back.out(1.7)'
					},
					'-=0.1'
				);

			// Bounce du poulet
			tl.to(resultElement, {
				y: -20,
				duration: 0.15,
				ease: 'power2.out'
			}).to(resultElement, {
				y: 0,
				duration: 0.15,
				ease: 'bounce.out'
			});

			// Confetti !
			const confettiStart = tl.time();
			tl.call(() => {
				const count = 50;
				const defaults = {
					origin: { y: 0.6 },
					colors: ['#FFD700', '#FF8C42', '#FF6B35', '#FFC107', '#FF5722']
				};

				function fire(particleRatio: number, opts: any) {
					confetti({
						...defaults,
						...opts,
						particleCount: Math.floor(count * particleRatio)
					});
				}

				fire(0.25, { spread: 26, startVelocity: 55 });
				fire(0.2, { spread: 60 });
				fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
				fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
				fire(0.1, { spread: 120, startVelocity: 45 });
			}, [], confettiStart);

			// Fade out final
			tl.to(overlayElement, {
				opacity: 0,
				duration: 0.3,
				ease: 'power2.in',
				delay: 0.2
			});
		} else {
			// 5b. ÉCHEC : L'œuf et les cracks disparaissent, 💨 apparaît brièvement
			tl.to([eggElement, cracksElement], {
				scale: 0.8,
				opacity: 0,
				duration: 0.25,
				ease: 'power2.in'
			})
				.fromTo(
					resultElement,
					{ scale: 0, opacity: 0 },
					{
						scale: 1,
						opacity: 0.7,
						duration: 0.2,
						ease: 'power1.out'
					},
					'-=0.1'
				)
				.to(resultElement, {
					opacity: 0,
					y: -30,
					duration: 0.3,
					ease: 'power1.in'
				})
				.to(
					overlayElement,
					{
						opacity: 0,
						duration: 0.2,
						ease: 'power2.in'
					},
					'-=0.1'
				);
		}
	}
</script>

{#if visible}
	<div
		bind:this={overlayElement}
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
	>
		<div class="relative">
			<!-- L'œuf 🥚 -->
			<div bind:this={eggElement} class="text-8xl sm:text-9xl">
				🥚
			</div>

			<!-- Les cracks -->
			<div
				bind:this={cracksElement}
				class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
			>
				<div class="relative text-6xl sm:text-7xl">
					<span class="absolute left-[-20px] top-[-15px] text-amber-600">✳️</span>
					<span class="absolute right-[-25px] top-[10px] text-amber-500">✳️</span>
					<span class="absolute bottom-[-10px] left-[5px] text-amber-700">✳️</span>
				</div>
			</div>

			<!-- Résultat (poulet ou fumée) -->
			<div
				bind:this={resultElement}
				class="absolute inset-0 flex items-center justify-center text-8xl opacity-0 sm:text-9xl"
			>
				<span>{isSuccess ? '🐔' : '💨'}</span>
			</div>
		</div>
	</div>
{/if}
