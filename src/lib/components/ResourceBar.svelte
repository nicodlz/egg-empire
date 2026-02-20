<script lang="ts">
	import { gameState } from '../state/gameState.svelte';
	import { formatNumber, formatRate } from '../engine/formulas';
	import { getTotalEggsPerSecond } from '../state/derived.svelte';

	const eggs = $derived(gameState.resources.get('eggs'));
	const eggsPerSecond = $derived(getTotalEggsPerSecond());
</script>

<div class="flex-shrink-0 bg-egg-cream/95 px-3 py-2">
	<div class="flex items-center justify-center gap-4">
		<div class="flex items-center gap-1.5">
			<span class="text-lg">🥚</span>
			<span class="big-number text-base font-bold text-sunset-orange">{eggs ? formatNumber(eggs.amount) : '0'}</span>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="text-xs text-gray-400">⚡</span>
			<span class="text-xs font-medium text-gray-600">{formatRate(eggsPerSecond)}</span>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="text-xs text-gray-400">👆</span>
			<span class="text-xs font-medium text-gray-600">{formatNumber(gameState.clickPower)}/tap</span>
		</div>
	</div>
</div>
