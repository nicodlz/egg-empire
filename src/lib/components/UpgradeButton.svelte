<script lang="ts">
	import type { Upgrade } from '../entities/Upgrade.svelte';
	import { formatNumber } from '../engine/formulas';
	import { buyUpgrade } from '../state/actions';
	import { getAffordableUpgrades } from '../state/derived.svelte';

	interface Props {
		upgrade: Upgrade;
	}

	let { upgrade }: Props = $props();

	const isAffordable = $derived(getAffordableUpgrades().has(upgrade.id));
</script>

{#if !upgrade.purchased}
<button
	class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all
		{isAffordable 
			? 'bg-white/80 active:scale-[0.98]' 
			: 'bg-white/30 opacity-60'}"
	onclick={() => buyUpgrade(upgrade.id)}
	disabled={!isAffordable}
	type="button"
>
	<span class="text-2xl">⬆️</span>
	<div class="flex flex-1 flex-col min-w-0">
		<span class="text-sm font-semibold text-gray-900 truncate">{upgrade.name}</span>
		<span class="text-xs text-gray-500">{upgrade.description}</span>
	</div>
	<span class="text-xs font-semibold whitespace-nowrap {isAffordable ? 'text-sunset-orange' : 'text-gray-400'}">
		{formatNumber(upgrade.cost)} {upgrade.resourceCost === 'money' ? '💰' : '🥚'}
	</span>
</button>
{/if}
