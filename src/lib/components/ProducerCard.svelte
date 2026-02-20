<script lang="ts">
	import type { Producer } from '../entities/Producer';
	import { formatNumber, formatRate } from '../engine/formulas';
	import { buyProducer } from '../state/actions';
	import { getAffordableProducers } from '../state/derived.svelte';
	import Card from './ui/card.svelte';
	import Button from './ui/button.svelte';
	import { gsap } from 'gsap';

	interface Props {
		producer: Producer;
	}

	let { producer }: Props = $props();
	let cardElement: HTMLDivElement | undefined = $state();

	const isAffordable = $derived(getAffordableProducers().has(producer.id));
	const cost = $derived(producer.getCurrentCost());
	const production = $derived(producer.getProduction());

	// GSAP pulse on affordable
	$effect(() => {
		if (isAffordable && cardElement) {
			gsap.to(cardElement, {
				boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
				duration: 0.8,
				yoyo: true,
				repeat: -1,
				ease: 'sine.inOut'
			});
		} else if (cardElement) {
			gsap.killTweensOf(cardElement);
			gsap.to(cardElement, { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', duration: 0.3 });
		}
	});

	function handleBuy() {
		if (buyProducer(producer.id, 1) && cardElement) {
			// GSAP success animation
			gsap.fromTo(cardElement,
				{ scale: 1 },
				{ scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.inOut' }
			);
		}
	}
</script>

<Card class="transition-all border-2 {isAffordable ? 'border-amber-400' : 'border-transparent'}" bind:this={cardElement}>
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-lg font-semibold text-gray-900">{producer.name}</h3>
		<span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-warm-orange to-sunset-orange text-sm font-bold text-white">
			{producer.owned}
		</span>
	</div>
	
	<p class="text-sm text-gray-600 mb-3 leading-relaxed">{producer.description}</p>
	
	<div class="flex justify-between text-sm mb-4">
		<span class="text-gray-500">Production:</span>
		<span class="font-semibold text-sunset-orange">{formatRate(production)}</span>
	</div>

	<Button
		onclick={handleBuy}
		disabled={!isAffordable}
		class="w-full"
	>
		Buy for {formatNumber(cost)} 🥚
	</Button>
</Card>
