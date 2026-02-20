<script lang="ts">
	import type { Producer } from '../entities/Producer.svelte';
	import { formatNumber, formatRate } from '../engine/formulas';
	import { buyProducer } from '../state/actions';
	import { getAffordableProducers } from '../state/derived.svelte';

	interface Props {
		producer: Producer;
	}

	let { producer }: Props = $props();

	const isAffordable = $derived(getAffordableProducers().has(producer.id));
	const cost = $derived(producer.getCurrentCost());
	const production = $derived(producer.getProduction());
</script>

<button
	class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all
		{isAffordable 
			? 'bg-white/80 active:scale-[0.98]' 
			: 'bg-white/30 opacity-60'}"
	onclick={() => buyProducer(producer.id, 1)}
	disabled={!isAffordable}
	type="button"
>
	<span class="text-2xl">{producer.emoji}</span>
	<div class="flex flex-1 flex-col min-w-0">
		<div class="flex items-center gap-2">
			<span class="text-sm font-semibold text-gray-900 truncate">{producer.name}</span>
			{#if producer.owned > 0}
				<span class="text-xs font-bold text-warm-orange">×{producer.owned}</span>
			{/if}
		</div>
		<span class="text-xs text-gray-500">+{formatRate(production)}</span>
	</div>
	<span class="text-xs font-semibold whitespace-nowrap {isAffordable ? 'text-sunset-orange' : 'text-gray-400'}">
		{formatNumber(cost)} {producer.resourceCost === 'money' ? '💰' : '🥚'}
	</span>
</button>
