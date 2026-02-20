<script lang="ts">
	import gsap from 'gsap';
	import type { AchievementManager } from '$lib/achievements/AchievementManager.svelte';

	interface Props {
		manager: AchievementManager;
		isOpen: boolean;
		onClose: () => void;
	}

	let { manager, isOpen = false, onClose }: Props = $props();

	let panelElement: HTMLDivElement;
	let overlayElement: HTMLDivElement;

	const allAchievements = manager.getAllAchievements();
	// Read reactive unlockedCount to trigger re-derivation when achievements change
	const progress = $derived.by(() => {
		void manager.unlockedCount;
		return manager.getProgress();
	});

	$effect(() => {
		if (!panelElement || !overlayElement) return;
		if (isOpen) {
			gsap.to(overlayElement, { opacity: 1, duration: 0.2, display: 'flex' });
			gsap.fromTo(panelElement, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
		} else {
			gsap.to(panelElement, { y: 40, opacity: 0, duration: 0.15 });
			gsap.to(overlayElement, { opacity: 0, duration: 0.15, onComplete: () => gsap.set(overlayElement, { display: 'none' }) });
		}
	});

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === overlayElement) onClose();
	}
</script>

{#if isOpen}
<div 
	bind:this={overlayElement}
	class="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
	onclick={handleOverlayClick}
	style="opacity: 0; display: none;"
>
	<div 
		bind:this={panelElement}
		class="flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-2xl sm:rounded-2xl bg-egg-cream"
		style="opacity: 0;"
	>
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3">
			<span class="text-base font-bold text-gray-900">🏆 Achievements — {progress.unlocked}/{progress.total}</span>
			<button class="text-lg text-gray-400" onclick={onClose} type="button">✕</button>
		</div>

		<!-- Progress bar -->
		<div class="mx-4 mb-3 h-2 rounded-full bg-gray-200 overflow-hidden">
			<div class="h-full rounded-full bg-amber-400 transition-all" style="width: {progress.percentage}%"></div>
		</div>

		<!-- List -->
		<div class="flex-1 overflow-y-auto px-4 pb-4">
			<div class="flex flex-col gap-2">
				{#each allAchievements as achievement}
					{@const unlocked = manager.isUnlocked(achievement.id)}
					<div class="flex items-center gap-3 rounded-xl px-3 py-2.5 {unlocked ? 'bg-white/80' : 'bg-white/30 opacity-50'}">
						<span class="text-2xl">{unlocked ? achievement.emoji : '🔒'}</span>
						<div class="flex flex-1 flex-col min-w-0">
							<span class="text-sm font-semibold text-gray-900 truncate">{unlocked ? achievement.name : '???'}</span>
							<span class="text-xs text-gray-500">{unlocked ? achievement.description : 'Locked'}</span>
						</div>
						{#if unlocked}
							<span class="text-xs text-green-600 font-medium whitespace-nowrap">✨ {achievement.reward}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
{/if}
