<script lang="ts">
import { onMount, onDestroy } from 'svelte';

interface Props {
	productionRate?: number;
}

let { productionRate = 1 }: Props = $props();

let canvas: HTMLCanvasElement;
let animationId: number;

// Particles de fumée
interface Particle {
	x: number;
	y: number;
	opacity: number;
	speed: number;
	size: number;
}

let particles: Particle[] = [];
let conveyorOffset = 0;
let gearRotation = 0;
let eggs: { x: number; y: number; phase: 'conveyor' | 'falling' }[] = [];
let eggCounter = 0;
let machineVibration = 0;

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
	// Murs gris industriels
	const gradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
	gradient.addColorStop(0, '#5a6268');
	gradient.addColorStop(1, '#4a5056');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height * 0.7);

	// Sol béton
	ctx.fillStyle = '#7a8288';
	ctx.fillRect(0, height * 0.7, width, height * 0.3);

	// Lignes de perspective sur le sol
	ctx.strokeStyle = '#6a7278';
	ctx.lineWidth = 2;
	for (let i = 0; i < 5; i++) {
		const y = height * 0.7 + i * 10;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}
}

function drawConveyorBelt(ctx: CanvasRenderingContext2D, width: number, height: number) {
	const beltY = height * 0.6;
	const beltHeight = 15;

	// Structure du tapis
	ctx.fillStyle = '#3d4449';
	ctx.fillRect(0, beltY, width, beltHeight);

	// Bande mobile avec motif
	ctx.fillStyle = '#2c3034';
	for (let i = -20; i < width + 20; i += 30) {
		const x = i + conveyorOffset;
		ctx.fillRect(x % width, beltY + 2, 20, beltHeight - 4);
	}

	// Bordures métalliques
	ctx.fillStyle = '#8a9296';
	ctx.fillRect(0, beltY - 3, width, 3);
	ctx.fillRect(0, beltY + beltHeight, width, 3);
}

function drawGear(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, teeth: number, rotation: number) {
	const innerRadius = radius * 0.7;
	const toothDepth = radius * 0.2;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	// Engrenage externe
	ctx.fillStyle = '#9a9ea2';
	ctx.strokeStyle = '#6a6e72';
	ctx.lineWidth = 2;
	ctx.beginPath();

	for (let i = 0; i < teeth; i++) {
		const angle = (i / teeth) * Math.PI * 2;
		const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
		const midAngle = (angle + nextAngle) / 2;

		// Pointe de la dent
		const toothX = Math.cos(midAngle) * radius;
		const toothY = Math.sin(midAngle) * radius;

		// Base de la dent
		const baseX1 = Math.cos(angle) * innerRadius;
		const baseY1 = Math.sin(angle) * innerRadius;
		const baseX2 = Math.cos(nextAngle) * innerRadius;
		const baseY2 = Math.sin(nextAngle) * innerRadius;

		if (i === 0) {
			ctx.moveTo(baseX1, baseY1);
		}
		ctx.lineTo(toothX, toothY);
		ctx.lineTo(baseX2, baseY2);
	}

	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Centre de l'engrenage
	ctx.fillStyle = '#5a5e62';
	ctx.beginPath();
	ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

function drawMachine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, vibration: number) {
	ctx.save();
	ctx.translate(x + vibration, y + vibration);

	// Corps de la machine
	const machineGradient = ctx.createLinearGradient(0, 0, width, 0);
	machineGradient.addColorStop(0, '#ff8c42');
	machineGradient.addColorStop(1, '#ff6b1a');
	ctx.fillStyle = machineGradient;
	ctx.fillRect(0, 0, width, height);

	// Bordures métalliques
	ctx.strokeStyle = '#8a9296';
	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, width, height);

	// Panneau de contrôle
	ctx.fillStyle = '#2c3034';
	ctx.fillRect(width * 0.1, height * 0.1, width * 0.3, height * 0.2);

	// Voyants
	ctx.fillStyle = '#00ff00';
	ctx.beginPath();
	ctx.arc(width * 0.15, height * 0.15, 3, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#ff0000';
	ctx.beginPath();
	ctx.arc(width * 0.15, height * 0.2, 3, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();
}

function drawChimney(ctx: CanvasRenderingContext2D, x: number, y: number) {
	// Cheminée
	ctx.fillStyle = '#5a5e62';
	ctx.fillRect(x, y, 20, 40);
	ctx.fillStyle = '#4a4e52';
	ctx.fillRect(x - 5, y + 35, 30, 8);
}

function drawEgg(ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 10) {
	ctx.fillStyle = '#f5f5dc';
	ctx.strokeStyle = '#d5d5bc';
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.ellipse(x, y, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
}

function drawCrate(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
	// Caisse en bois
	ctx.fillStyle = '#8b6f47';
	ctx.fillRect(x, y, width, height);

	// Planches
	ctx.strokeStyle = '#5a4527';
	ctx.lineWidth = 2;
	for (let i = 0; i < 3; i++) {
		const plankY = y + i * (height / 3);
		ctx.beginPath();
		ctx.moveTo(x, plankY);
		ctx.lineTo(x + width, plankY);
		ctx.stroke();
	}

	// Bordure
	ctx.strokeStyle = '#3a2507';
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, width, height);
}

function drawLEDCounter(ctx: CanvasRenderingContext2D, x: number, y: number, count: number) {
	// Fond du compteur
	ctx.fillStyle = '#1a1a1a';
	ctx.fillRect(x, y, 80, 25);
	ctx.strokeStyle = '#8a9296';
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, 80, 25);

	// Chiffres LED
	ctx.fillStyle = '#00ff00';
	ctx.font = 'bold 16px monospace';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(count.toString().padStart(4, '0'), x + 40, y + 12);
}

function updateParticles(width: number, height: number) {
	// Ajouter de nouvelles particules de fumée
	if (Math.random() < 0.1 * productionRate) {
		particles.push({
			x: width * 0.2 + Math.random() * 10,
			y: height * 0.15,
			opacity: 0.8,
			speed: 0.5 + Math.random() * 0.5,
			size: 3 + Math.random() * 3
		});
	}

	// Mettre à jour les particules existantes
	particles = particles
		.map(p => ({
			...p,
			y: p.y - p.speed * productionRate,
			opacity: p.opacity - 0.01 * productionRate
		}))
		.filter(p => p.opacity > 0 && p.y > 0);
}

function updateEggs(width: number, height: number) {
	const beltY = height * 0.6;

	// Ajouter de nouveaux œufs sur le tapis
	if (Math.random() < 0.02 * productionRate) {
		eggs.push({
			x: 10,
			y: beltY + 7,
			phase: 'conveyor'
		});
	}

	// Mettre à jour les œufs
	eggs = eggs.map(egg => {
		if (egg.phase === 'conveyor') {
			egg.x += 1 * productionRate;
			// Si l'œuf arrive à la fin du tapis, il tombe
			if (egg.x > width - 80) {
				return { ...egg, phase: 'falling' as const };
			}
		} else if (egg.phase === 'falling') {
			egg.y += 2 * productionRate;
			// Si l'œuf arrive dans la caisse, on le compte et on le supprime
			if (egg.y > height * 0.65) {
				eggCounter++;
				return null as any;
			}
		}
		return egg;
	}).filter(Boolean);
}

function animate() {
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const width = canvas.width;
	const height = canvas.height;

	// Clear
	ctx.clearRect(0, 0, width, height);

	// Dessiner les éléments
	drawBackground(ctx, width, height);
	drawConveyorBelt(ctx, width, height);

	// Machine principale
	machineVibration = Math.sin(Date.now() / 100) * 0.5;
	drawMachine(ctx, width * 0.15, height * 0.3, 80, 60, machineVibration);

	// Cheminée et fumée
	drawChimney(ctx, width * 0.2, height * 0.1);

	// Particules de fumée
	particles.forEach(p => {
		ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();
	});

	// Engrenages visibles
	drawGear(ctx, width * 0.25, height * 0.45, 15, 8, gearRotation);
	drawGear(ctx, width * 0.35, height * 0.45, 12, 8, -gearRotation * 1.2);

	// Œufs
	eggs.forEach(egg => {
		drawEgg(ctx, egg.x, egg.y);
	});

	// Caisse de réception
	drawCrate(ctx, width - 70, height * 0.65, 60, 45);

	// Compteur LED
	drawLEDCounter(ctx, width - 90, height * 0.05, eggCounter);

	// Mettre à jour les animations
	conveyorOffset = (conveyorOffset + 1 * productionRate) % 30;
	gearRotation += 0.05 * productionRate;
	updateParticles(width, height);
	updateEggs(width, height);

	animationId = requestAnimationFrame(animate);
}

function resizeCanvas() {
	if (!canvas) return;
	const parent = canvas.parentElement;
	if (!parent) return;

	const dpr = window.devicePixelRatio || 1;
	const rect = parent.getBoundingClientRect();

	canvas.width = rect.width * dpr;
	canvas.height = 180 * dpr;
	canvas.style.width = `${rect.width}px`;
	canvas.style.height = '180px';

	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.scale(dpr, dpr);
	}
}

onMount(() => {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
	animate();
});

onDestroy(() => {
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
	window.removeEventListener('resize', resizeCanvas);
});
</script>

<div class="factory-scene">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.factory-scene {
		width: 100%;
		height: 180px;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	canvas {
		display: block;
		width: 100%;
		height: 180px;
	}
</style>
