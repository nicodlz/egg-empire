<script lang="ts">
	import { gsap } from 'gsap';

	interface Props {
		chickenCount: number;
	}

	interface Chicken {
		id: number;
		x: number; // position X en %
		y: number; // position Y en %
		size: string; // text-xl, text-2xl, text-3xl
		element?: HTMLDivElement;
	}

	let { chickenCount }: Props = $props();

	const MAX_VISIBLE_CHICKENS = 20;
	const SIZE_CLASSES = ['text-xl', 'text-2xl', 'text-3xl'];

	let chickens = $state<Chicken[]>([]);
	let previousCount = 0;

	// Génère une position aléatoire pour un poulet
	function generateChickenPosition(id: number): Chicken {
		return {
			id,
			x: Math.random() * 85, // 0-85% pour éviter les bords
			y: Math.random() * 70, // 0-70% pour éviter les bords
			size: SIZE_CLASSES[Math.floor(Math.random() * SIZE_CLASSES.length)]
		};
	}

	// Anime l'idle d'un poulet (mouvement gauche-droite aléatoire)
	function animateChickenIdle(chicken: Chicken) {
		if (!chicken.element) return;

		const randomDelay = Math.random() * 2;
		const randomDuration = 2 + Math.random() * 2;
		const randomDistance = 10 + Math.random() * 20;

		gsap.to(chicken.element, {
			x: `+=${randomDistance}`,
			duration: randomDuration,
			delay: randomDelay,
			ease: 'sine.inOut',
			yoyo: true,
			repeat: -1
		});
	}

	// Anime l'entrée d'un nouveau poulet (pop in)
	function animateChickenEntry(element: HTMLDivElement) {
		gsap.fromTo(
			element,
			{
				scale: 0,
				opacity: 0
			},
			{
				scale: 1,
				opacity: 1,
				duration: 0.5,
				ease: 'back.out(1.7)'
			}
		);
	}

	// Détecte quand chickenCount augmente
	$effect(() => {
		const currentCount = chickenCount;
		
		if (currentCount > previousCount) {
			// Ajouter de nouveaux poulets
			for (let i = previousCount; i < currentCount; i++) {
				const newChicken = generateChickenPosition(i);
				chickens.push(newChicken);
			}
			chickens = [...chickens]; // Force reactivity
		} else if (currentCount < previousCount) {
			// Retirer des poulets
			chickens = chickens.slice(0, currentCount);
		}

		previousCount = currentCount;
	});

	// Initialise les animations idle quand un poulet est monté
	function handleChickenMount(chicken: Chicken) {
		return (element: HTMLDivElement) => {
			chicken.element = element;
			animateChickenEntry(element);
			// Attendre la fin de l'animation d'entrée avant de commencer l'idle
			setTimeout(() => animateChickenIdle(chicken), 500);
		};
	}

	// Poulets à afficher (max 20)
	const visibleChickens = $derived(chickens.slice(0, MAX_VISIBLE_CHICKENS));
	
	// Compteur pour les poulets au-delà de 20
	const extraChickens = $derived(
		chickenCount > MAX_VISIBLE_CHICKENS ? chickenCount - MAX_VISIBLE_CHICKENS : 0
	);
</script>

<div class="relative w-full h-48 bg-amber-50/50 rounded-lg overflow-hidden">
	{#each visibleChickens as chicken (chicken.id)}
		<div
			use:handleChickenMount={chicken}
			class="absolute {chicken.size} cursor-default select-none"
			style="left: {chicken.x}%; top: {chicken.y}%;"
		>
			🐔
		</div>
	{/each}

	{#if extraChickens > 0}
		<div
			class="absolute bottom-2 right-3 text-lg font-semibold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full"
		>
			🐔 ×{extraChickens + MAX_VISIBLE_CHICKENS}
		</div>
	{/if}
</div>
