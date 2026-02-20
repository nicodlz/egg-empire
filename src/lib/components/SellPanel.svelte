<script lang="ts">
	import { gameState } from '../state/gameState.svelte';
	import { sellEggs, sellChickens } from '../state/actions';
	import { formatNumber } from '../engine/formulas';
	import { SELL_PRICES, EGG_BUNDLES, CHICKEN_BUNDLES } from '../engine/constants';

	const eggs = $derived(gameState.resources.get('eggs'));
	const chicken = $derived(gameState.producers.get('chicken'));

	function canSellEggs(amount: number): boolean {
		return !!eggs && eggs.canAfford(new (eggs.amount.constructor as any)(amount));
	}

	function canSellChickens(amount: number): boolean {
		return !!chicken && chicken.owned >= amount;
	}
</script>

<div class="flex flex-col gap-2">
	<div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Sell Eggs → 💰{formatNumber(SELL_PRICES.EGG)}/egg</div>
	<div class="flex flex-wrap gap-1.5">
		{#each EGG_BUNDLES as amount}
			<button
				class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
					{canSellEggs(amount)
						? 'bg-green-500/20 text-green-700 active:scale-95'
						: 'bg-gray-100 text-gray-400'}"
				onclick={() => sellEggs(amount)}
				disabled={!canSellEggs(amount)}
				type="button"
			>
				🥚×{amount}
			</button>
		{/each}
	</div>

	<div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mt-1">Sell Chickens → 💰{formatNumber(SELL_PRICES.CHICKEN)}/chicken</div>
	<div class="flex flex-wrap gap-1.5">
		{#each CHICKEN_BUNDLES as amount}
			<button
				class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
					{canSellChickens(amount)
						? 'bg-amber-500/20 text-amber-700 active:scale-95'
						: 'bg-gray-100 text-gray-400'}"
				onclick={() => sellChickens(amount)}
				disabled={!canSellChickens(amount)}
				type="button"
			>
				🐔×{amount}
			</button>
		{/each}
	</div>
</div>
