<script lang="ts">
	import { getPhaseProgress } from '../state/derived.svelte';
	import { gsap } from 'gsap';
	import Card from './ui/card.svelte';

	interface Props {
		label?: string;
	}

	let { label = 'Next Phase' }: Props = $props();
	let fillElement: HTMLDivElement;
	let previousProgress = 0;

	const progress = $derived(Math.min(getPhaseProgress(), 100));

	// GSAP smooth progress animation
	$effect(() => {
		if (fillElement && progress !== previousProgress) {
			gsap.to(fillElement, {
				width: `${progress}%`,
				duration: 0.5,
				ease: 'power2.out'
			});
			previousProgress = progress;
		}
	});
</script>

<Card>
	<div class="flex items-center justify-between mb-2">
		<span class="text-sm font-semibold text-gray-700">{label}</span>
		<span class="text-sm font-bold text-sunset-orange">{progress.toFixed(1)}%</span>
	</div>
	<div class="h-6 rounded-full border-2 border-amber-400 bg-amber-50 overflow-hidden relative">
		<div 
			bind:this={fillElement}
			class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-inner"
			style="width: 0%"
		></div>
	</div>
</Card>
