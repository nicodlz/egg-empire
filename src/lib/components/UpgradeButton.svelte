<script lang="ts">
	import type { Upgrade } from '../entities/Upgrade.svelte';
	import { formatNumber } from '../engine/formulas';
	import { buyUpgrade } from '../state/actions';
	import { getAffordableUpgrades } from '../state/derived.svelte';
	import { gsap } from 'gsap';

	interface Props {
		upgrade: Upgrade;
	}

	let { upgrade }: Props = $props();
	let buttonElement: HTMLElement | undefined = $state();

	const isAffordable = $derived(getAffordableUpgrades().has(upgrade.id));

	// GSAP glow effect when affordable
	$effect(() => {
		if (isAffordable && buttonElement && !upgrade.purchased) {
			gsap.to(buttonElement, {
				boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
				duration: 0.7,
				yoyo: true,
				repeat: -1,
				ease: 'sine.inOut'
			});
		} else if (buttonElement) {
			gsap.killTweensOf(buttonElement);
			gsap.to(buttonElement, { boxShadow: 'none', duration: 0.2 });
		}
	});

	function handleBuy() {
		if (buyUpgrade(upgrade.id) && buttonElement) {
			// Success animation
			gsap.fromTo(buttonElement,
				{ scale: 1 },
				{ scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out' }
			);
		}
	}
</script>

<button
	class="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full text-left h-auto py-3 px-4 {upgrade.purchased ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95' : isAffordable ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg active:scale-95' : 'bg-white border-2 border-amber-400 text-gray-900 shadow hover:bg-amber-50 active:scale-95'}"
	onclick={handleBuy}
	disabled={upgrade.purchased || !isAffordable}
	type="button"
	bind:this={buttonElement}
>
	<div class="flex flex-col gap-1.5 w-full">
		<div class="flex items-center justify-between w-full">
			<h4 class="font-semibold">{upgrade.name}</h4>
			{#if upgrade.purchased}
				<span class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600 text-sm font-bold">✓</span>
			{/if}
		</div>
		<p class="text-xs opacity-90 font-normal">{upgrade.description}</p>
		{#if !upgrade.purchased}
			<div class="text-sm font-bold mt-1">
				{formatNumber(upgrade.cost)} 🥚
			</div>
		{/if}
	</div>
</button>
