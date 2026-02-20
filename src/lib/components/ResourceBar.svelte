<script lang="ts">
	import { gameState } from '../state/gameState.svelte';
	import { formatNumber, formatRate } from '../engine/formulas';
	import { getTotalEggsPerSecond } from '../state/derived.svelte';

	const eggs = $derived(gameState.resources.get('eggs'));
	const eggsPerSecond = $derived(getTotalEggsPerSecond());
</script>

<div class="sticky top-0 z-50 border-b-2 border-amber-200 bg-gradient-to-r from-egg-cream/95 to-egg-shell/95 backdrop-blur-sm px-4 py-3 shadow-md">
	<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 sm:gap-6">
		<div class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
			<span class="text-2xl">🥚</span>
			<div class="flex flex-col">
				<div class="big-number text-lg font-bold text-sunset-orange sm:text-xl">
					{eggs ? formatNumber(eggs.amount) : '0'}
				</div>
				<div class="text-xs text-gray-500">
					{formatRate(eggsPerSecond)}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
			<span class="text-2xl">👆</span>
			<div class="flex flex-col">
				<div class="big-number text-lg font-bold text-sunset-orange sm:text-xl">
					{formatNumber(gameState.clickPower)}
				</div>
				<div class="text-xs text-gray-500">per click</div>
			</div>
		</div>

		<div class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
			<span class="text-2xl">📊</span>
			<div class="flex flex-col">
				<div class="big-number text-lg font-bold text-sunset-orange sm:text-xl">
					{eggs ? formatNumber(eggs.totalEarned) : '0'}
				</div>
				<div class="text-xs text-gray-500">lifetime</div>
			</div>
		</div>
	</div>
</div>
