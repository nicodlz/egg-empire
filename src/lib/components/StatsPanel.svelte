<script lang="ts">
	import { gameState } from '../state/gameState.svelte';
	import { formatNumber, formatDuration } from '../engine/formulas';
	import Button from './ui/button.svelte';
	import { gsap } from 'gsap';

	let showStats = $state(false);
	let modalElement: HTMLDivElement | undefined = $state();
	let contentElement: HTMLDivElement | undefined = $state();

	const totalEggsProduced = $derived(
		gameState.resources.get('eggs')?.totalEarned ?? gameState.statistics.totalEggsProduced
	);

	function toggleStats() {
		if (!showStats) {
			showStats = true;
			// GSAP modal entrance
			requestAnimationFrame(() => {
				if (modalElement && contentElement) {
					gsap.fromTo(modalElement,
						{ opacity: 0 },
						{ opacity: 1, duration: 0.2 }
					);
					gsap.fromTo(contentElement,
						{ y: 20, opacity: 0, scale: 0.95 },
						{ y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
					);
				}
			});
		} else {
			// GSAP modal exit
			if (modalElement && contentElement) {
				gsap.to(contentElement, {
					y: 20,
					opacity: 0,
					scale: 0.95,
					duration: 0.2,
					ease: 'power2.in'
				});
				gsap.to(modalElement, {
					opacity: 0,
					duration: 0.2,
					onComplete: () => { showStats = false; }
				});
			}
		}
	}
</script>

<div class="fixed bottom-4 right-4 z-[1000]">
	<Button onclick={toggleStats} variant="secondary" class="shadow-lg">
		📊 Stats
	</Button>

	{#if showStats}
		<div 
			bind:this={modalElement}
			role="button"
			tabindex="0"
			class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
			onclick={toggleStats}
			onkeydown={(e) => e.key === 'Escape' && toggleStats()}
		>
			<div 
				bind:this={contentElement}
				role="dialog"
				tabindex="-1"
				class="w-11/12 max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && toggleStats()}
			>
				<h2 class="mb-6 text-center text-3xl font-bold text-gray-900">Statistics</h2>
				
				<div class="mb-6 grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl bg-egg-shell p-4">
						<div class="text-sm text-gray-600">Total Eggs Produced</div>
						<div class="mt-1 text-2xl font-bold text-sunset-orange">
							{formatNumber(totalEggsProduced)}
						</div>
					</div>

					<div class="rounded-xl bg-egg-shell p-4">
						<div class="text-sm text-gray-600">Total Clicks</div>
						<div class="mt-1 text-2xl font-bold text-sunset-orange">
							{gameState.statistics.totalClicks.toLocaleString()}
						</div>
					</div>

					<div class="rounded-xl bg-egg-shell p-4">
						<div class="text-sm text-gray-600">Play Time</div>
						<div class="mt-1 text-2xl font-bold text-sunset-orange">
							{formatDuration(gameState.totalPlayTime * 1000)}
						</div>
					</div>

					<div class="rounded-xl bg-egg-shell p-4">
						<div class="text-sm text-gray-600">Current Phase</div>
						<div class="mt-1 text-2xl font-bold text-sunset-orange">
							{gameState.phases.get(gameState.currentPhase)?.name ?? 'Unknown'}
						</div>
					</div>
				</div>

				<Button onclick={toggleStats} class="w-full">
					Close
				</Button>
			</div>
		</div>
	{/if}
</div>
