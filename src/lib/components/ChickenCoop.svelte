<script lang="ts">
	interface Props {
		chickenCount: number;
	}

	let { chickenCount }: Props = $props();

	// Types
	interface Chicken {
		id: number;
		x: number;
		y: number;
		vx: number; // velocity X
		direction: 1 | -1; // 1 = right, -1 = left
		size: number; // scale factor 0.8-1.2
		hue: number; // hue shift pour variété de couleur
		state: 'walk' | 'peck' | 'idle';
		stateTimer: number;
		peckProgress: number; // 0-1 pour animation de picorage
		breatheOffset: number; // offset pour breathing
		bounceProgress: number; // 0-1 pour animation d'entrée
	}

	// State
	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx = $state<CanvasRenderingContext2D | null>(null);
	let chickens = $state<Chicken[]>([]);
	let rafId = 0;
	let previousCount = 0;
	let canvasWidth = 0;
	let canvasHeight = 180;

	// Constants
	const MAX_VISIBLE = 20;
	const CHICKEN_BASE_SIZE = 25;

	// Créer un nouveau poulet
	function createChicken(id: number): Chicken {
		return {
			id,
			x: Math.random() * (canvasWidth - 60) + 30,
			y: canvasHeight - 60 + Math.random() * 20,
			vx: (Math.random() - 0.5) * 0.5,
			direction: Math.random() > 0.5 ? 1 : -1,
			size: 0.8 + Math.random() * 0.4,
			hue: Math.random() * 20 - 10, // -10 to +10
			state: 'walk',
			stateTimer: 0,
			peckProgress: 0,
			breatheOffset: Math.random() * Math.PI * 2,
			bounceProgress: 0
		};
	}

	// Dessiner le fond (poulailler)
	function drawBackground(ctx: CanvasRenderingContext2D) {
		// Ciel (dégradé)
		const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.7);
		skyGradient.addColorStop(0, '#b8dff5');
		skyGradient.addColorStop(1, '#e8f4f8');
		ctx.fillStyle = skyGradient;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// Herbe
		const grassGradient = ctx.createLinearGradient(0, canvasHeight * 0.7, 0, canvasHeight);
		grassGradient.addColorStop(0, '#7cb342');
		grassGradient.addColorStop(1, '#558b2f');
		ctx.fillStyle = grassGradient;
		ctx.fillRect(0, canvasHeight * 0.7, canvasWidth, canvasHeight * 0.3);

		// Touffes d'herbe
		ctx.fillStyle = '#689f38';
		for (let i = 0; i < 15; i++) {
			const x = (i / 14) * canvasWidth;
			const y = canvasHeight * 0.7 + Math.sin(i) * 5;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x - 3, y + 10);
			ctx.lineTo(x + 3, y + 10);
			ctx.closePath();
			ctx.fill();
		}

		// Clôture simple (optionnelle)
		ctx.strokeStyle = '#5d4037';
		ctx.lineWidth = 3;
		for (let i = 0; i < 6; i++) {
			const x = (i / 5) * canvasWidth;
			ctx.beginPath();
			ctx.moveTo(x, canvasHeight * 0.6);
			ctx.lineTo(x, canvasHeight * 0.75);
			ctx.stroke();
		}
		// Barres horizontales
		ctx.beginPath();
		ctx.moveTo(0, canvasHeight * 0.65);
		ctx.lineTo(canvasWidth, canvasHeight * 0.65);
		ctx.stroke();
	}

	// Dessiner un poulet
	function drawChicken(ctx: CanvasRenderingContext2D, chicken: Chicken) {
		ctx.save();
		ctx.translate(chicken.x, chicken.y);

		// Bounce animation pour entrée
		if (chicken.bounceProgress < 1) {
			const bounce = Math.sin(chicken.bounceProgress * Math.PI) * 0.3;
			ctx.scale(0.7 + chicken.bounceProgress * 0.3 + bounce, 0.7 + chicken.bounceProgress * 0.3 + bounce);
		}

		// Direction (flip horizontal)
		ctx.scale(chicken.direction, 1);

		const size = CHICKEN_BASE_SIZE * chicken.size;

		// Breathing animation
		const breathe = Math.sin(Date.now() / 500 + chicken.breatheOffset) * 0.05 + 1;

		// Peck animation (tête baisse)
		const peckAngle = chicken.peckProgress * 0.6;

		// Corps (ellipse)
		ctx.fillStyle = `hsl(${40 + chicken.hue}, 15%, 92%)`;
		ctx.beginPath();
		ctx.ellipse(0, 0, size * 0.6 * breathe, size * 0.7 * breathe, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = `hsl(${40 + chicken.hue}, 15%, 80%)`;
		ctx.lineWidth = 1;
		ctx.stroke();

		// Aile (arc simple)
		ctx.strokeStyle = `hsl(${40 + chicken.hue}, 15%, 75%)`;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(size * 0.2, 0, size * 0.4, -0.3, 0.8);
		ctx.stroke();

		// Tête
		ctx.save();
		ctx.translate(-size * 0.4, -size * 0.3);
		ctx.rotate(peckAngle);

		ctx.fillStyle = `hsl(${40 + chicken.hue}, 18%, 95%)`;
		ctx.beginPath();
		ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = `hsl(${40 + chicken.hue}, 15%, 80%)`;
		ctx.lineWidth = 1;
		ctx.stroke();

		// Œil
		ctx.fillStyle = '#000';
		ctx.beginPath();
		ctx.arc(-size * 0.15, -size * 0.05, size * 0.06, 0, Math.PI * 2);
		ctx.fill();

		// Bec
		ctx.fillStyle = '#ff9800';
		ctx.beginPath();
		ctx.moveTo(-size * 0.35, 0);
		ctx.lineTo(-size * 0.5, -size * 0.05);
		ctx.lineTo(-size * 0.35, -size * 0.1);
		ctx.closePath();
		ctx.fill();

		// Crête
		ctx.fillStyle = '#f44336';
		ctx.beginPath();
		ctx.arc(-size * 0.05, -size * 0.3, size * 0.15, Math.PI, 0);
		ctx.arc(size * 0.05, -size * 0.35, size * 0.12, Math.PI, 0);
		ctx.fill();

		ctx.restore(); // fin tête

		// Pattes
		const legOffset = chicken.state === 'walk' ? Math.sin(Date.now() / 200 + chicken.id) * 2 : 0;
		ctx.strokeStyle = '#ff9800';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-size * 0.2, size * 0.6);
		ctx.lineTo(-size * 0.2 + legOffset, size * 0.9);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(size * 0.2, size * 0.6);
		ctx.lineTo(size * 0.2 - legOffset, size * 0.9);
		ctx.stroke();

		// Queue
		ctx.strokeStyle = `hsl(${40 + chicken.hue}, 15%, 70%)`;
		ctx.lineWidth = 1.5;
		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.moveTo(size * 0.5, -size * 0.2 + i * 5);
			ctx.lineTo(size * 0.8, -size * 0.3 + i * 5);
			ctx.stroke();
		}

		ctx.restore();
	}

	// Update chicken AI
	function updateChicken(chicken: Chicken, deltaTime: number) {
		chicken.stateTimer += deltaTime;

		// Update bounce animation
		if (chicken.bounceProgress < 1) {
			chicken.bounceProgress = Math.min(1, chicken.bounceProgress + deltaTime / 500);
		}

		// State machine
		if (chicken.state === 'walk') {
			chicken.x += chicken.vx;

			// Rebond sur les bords
			if (chicken.x < 30 || chicken.x > canvasWidth - 30) {
				chicken.direction *= -1;
				chicken.vx *= -1;
			}

			// Changement d'état aléatoire
			if (chicken.stateTimer > 2000 && Math.random() < 0.01) {
				chicken.state = Math.random() > 0.5 ? 'peck' : 'idle';
				chicken.stateTimer = 0;
				chicken.vx = 0;
			}
		} else if (chicken.state === 'peck') {
			// Animation de picorage
			chicken.peckProgress = Math.sin((chicken.stateTimer / 800) * Math.PI);

			if (chicken.stateTimer > 1500) {
				chicken.state = 'walk';
				chicken.stateTimer = 0;
				chicken.peckProgress = 0;
				chicken.vx = (Math.random() - 0.5) * 0.5;
				chicken.direction = chicken.vx > 0 ? 1 : -1;
			}
		} else if (chicken.state === 'idle') {
			if (chicken.stateTimer > 1000 && Math.random() < 0.02) {
				chicken.state = 'walk';
				chicken.stateTimer = 0;
				chicken.vx = (Math.random() - 0.5) * 0.5;
				chicken.direction = chicken.vx > 0 ? 1 : -1;
			}
		}
	}

	// Game loop
	let lastTime = 0;
	function animate(time: number) {
		if (!ctx) return;

		const deltaTime = time - lastTime;
		lastTime = time;

		// Clear et dessiner fond
		drawBackground(ctx);

		// Update et dessiner poulets
		const visibleChickens = chickens.slice(0, MAX_VISIBLE);
		visibleChickens.forEach(chicken => {
			updateChicken(chicken, deltaTime);
			drawChicken(ctx!, chicken);
		});

		rafId = requestAnimationFrame(animate);
	}

	// Gestion du resize
	function handleResize() {
		if (!canvas) return;
		const rect = canvas.parentElement?.getBoundingClientRect();
		if (rect) {
			canvasWidth = rect.width;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
		}
	}

	// Effet: setup canvas
	$effect(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			handleResize();
			window.addEventListener('resize', handleResize);

			rafId = requestAnimationFrame(animate);

			return () => {
				window.removeEventListener('resize', handleResize);
				cancelAnimationFrame(rafId);
			};
		}
	});

	// Effet: sync chicken count
	$effect(() => {
		const currentCount = chickenCount;

		if (currentCount > previousCount) {
			// Ajouter nouveaux poulets
			for (let i = previousCount; i < currentCount; i++) {
				chickens.push(createChicken(i));
			}
		} else if (currentCount < previousCount) {
			// Retirer poulets
			chickens = chickens.slice(0, currentCount);
		}

		previousCount = currentCount;
	});

	// Badge count
	const showBadge = $derived(chickenCount > MAX_VISIBLE);
	const badgeCount = $derived(chickenCount);
</script>

<div class="relative w-full">
	<canvas
		bind:this={canvas}
		class="w-full rounded-lg"
		style="height: {canvasHeight}px"
	></canvas>

	{#if showBadge}
		<div
			class="absolute bottom-2 right-3 text-lg font-semibold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full shadow-md backdrop-blur-sm"
		>
			🐔 ×{badgeCount}
		</div>
	{/if}
</div>
