<script lang="ts">
	import type { Achievement } from '$lib/achievements/achievements';

	interface Props {
		achievements: Achievement[];
		onClear: () => void;
	}

	let { achievements, onClear }: Props = $props();

	let visible = $state(false);
	let current = $state<Achievement | null>(null);
	let processing = false;
	let queue: Achievement[] = [];

	// When new achievements arrive, add to internal queue and start processing
	$effect(() => {
		if (achievements.length === 0) return;
		// Copy to internal queue, then immediately clear parent
		queue.push(...achievements);
		// Use queueMicrotask to avoid mutating parent state during effect
		queueMicrotask(() => onClear());
		if (!processing) processQueue();
	});

	function processQueue() {
		if (queue.length === 0) {
			processing = false;
			return;
		}
		processing = true;
		current = queue.shift()!;
		visible = true;

		// Auto-hide after 2.5s, then show next
		setTimeout(() => {
			visible = false;
			setTimeout(() => processQueue(), 400);
		}, 2500);
	}
</script>

{#if current && visible}
	<div class="toast" class:show={visible}>
		<span class="emoji">{current.emoji}</span>
		<div class="text">
			<div class="label">Achievement Unlocked!</div>
			<div class="name">{current.name}</div>
		</div>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		top: 12px;
		left: 50%;
		transform: translateX(-50%) translateY(-120px);
		z-index: 9999;
		pointer-events: none;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #fff8e1;
		padding: 12px 20px;
		border-radius: 14px;
		opacity: 0;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
		max-width: calc(100vw - 32px);
	}
	.toast.show {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
	}
	.emoji {
		font-size: 32px;
		line-height: 1;
	}
	.text {
		flex: 1;
		min-width: 0;
	}
	.label {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #a0855c;
	}
	.name {
		font-size: 15px;
		font-weight: 700;
		color: #4a3728;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
