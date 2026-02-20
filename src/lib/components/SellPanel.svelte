<script lang="ts">
	import Decimal from 'break_eternity.js';
	import { gameState } from '../state/gameState.svelte';
	import { sellEggs, sellChickens } from '../state/actions';
	import { formatNumber } from '../engine/formulas';
	import { SELL_PRICES } from '../engine/constants';

	const eggs = $derived(gameState.resources.get('eggs'));
	const chicken = $derived(gameState.producers.get('chicken'));
	const eggCount = $derived(eggs ? eggs.amount.toNumber() : 0);
	const chickenCount = $derived(chicken ? chicken.owned : 0);

	// Generate smart bundles based on what you have
	function getBundles(count: number): number[] {
		const tiers = [1, 6, 12, 24, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
		// Show bundles you can almost or actually afford, plus one tier above
		const relevant = tiers.filter(t => t <= count * 2 && t >= 1);
		// Keep last 4-5 relevant tiers to avoid clutter
		const result = relevant.slice(-5);
		// Always include "all" if count > 0
		if (count > 0 && !result.includes(Math.floor(count))) {
			result.push(Math.floor(count));
		}
		return [...new Set(result)].sort((a, b) => a - b);
	}

	function getChickenBundles(count: number): number[] {
		const tiers = [1, 5, 10, 50, 100, 500, 1000];
		const relevant = tiers.filter(t => t <= count * 2 && t >= 1);
		return relevant.slice(-4);
	}

	const eggBundles = $derived(getBundles(eggCount));
	const chickenBundles = $derived(getChickenBundles(chickenCount));

	function formatBundle(n: number): string {
		if (n >= 1000000) return `${n / 1000000}M`;
		if (n >= 1000) return `${n / 1000}K`;
		return `${n}`;
	}
</script>

<div class="flex flex-col gap-2">
	<div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Sell Eggs → 💰{formatNumber(SELL_PRICES.EGG)}/egg</div>
	<div class="flex flex-wrap gap-1.5">
		{#each eggBundles as amount (amount)}
			<button
				class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
					{eggCount >= amount
						? 'bg-green-500/20 text-green-700 active:scale-95'
						: 'bg-gray-100 text-gray-400'}"
				onclick={() => sellEggs(amount)}
				disabled={eggCount < amount}
				type="button"
			>
				🥚{formatBundle(amount)}
			</button>
		{/each}
	</div>

	{#if chickenBundles.length > 0}
		<div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mt-1">Sell Chickens → 💰{formatNumber(SELL_PRICES.CHICKEN)}/chicken</div>
		<div class="flex flex-wrap gap-1.5">
			{#each chickenBundles as amount (amount)}
				<button
					class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
						{chickenCount >= amount
							? 'bg-amber-500/20 text-amber-700 active:scale-95'
							: 'bg-gray-100 text-gray-400'}"
					onclick={() => sellChickens(amount)}
					disabled={chickenCount < amount}
					type="button"
				>
					🐔{formatBundle(amount)}
				</button>
			{/each}
		</div>
	{/if}
</div>
