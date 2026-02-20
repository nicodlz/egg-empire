<script lang="ts">
	import { gsap } from 'gsap';

	interface FloatingItem {
		id: number;
		text: string;
		x: number;
	}

	let items = $state<FloatingItem[]>([]);
	let container: HTMLDivElement;
	let nextId = 0;

	/**
	 * Spawn a new floating text animation
	 * @param value - The text to display (e.g., "+1", "+100")
	 */
	export function spawn(value: string) {
		// Random horizontal offset for variety (-30px to +30px)
		const randomX = (Math.random() - 0.5) * 60;
		
		const id = nextId++;
		const item: FloatingItem = {
			id,
			text: value,
			x: randomX
		};

		items = [...items, item];

		// Wait for DOM update, then animate
		setTimeout(() => {
			const element = container?.querySelector(`[data-floating-id="${id}"]`) as HTMLElement;
			if (!element) return;

			gsap.timeline()
				.fromTo(element, 
					{
						y: 0,
						opacity: 1,
						scale: 0.8
					},
					{
						y: -80,
						opacity: 0,
						scale: 1,
						duration: 0.8,
						ease: 'power2.out',
						onComplete: () => {
							// Remove from items array after animation
							items = items.filter(i => i.id !== id);
						}
					}
				);
		}, 10);
	}
</script>

<div bind:this={container} class="pointer-events-none absolute inset-0 flex items-center justify-center">
	{#each items as item (item.id)}
		<div
			data-floating-id={item.id}
			class="absolute text-lg font-bold text-sunset-orange will-change-transform"
			style="left: 50%; transform: translateX(calc(-50% + {item.x}px));"
		>
			{item.text}
		</div>
	{/each}
</div>
