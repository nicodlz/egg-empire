<script lang="ts">
import { onMount, onDestroy } from 'svelte';

interface Props {
	productionRate: number;
}

let { productionRate }: Props = $props();

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let animationId: number;
let time = 0;

// Étoiles scintillantes
interface Star {
	x: number;
	y: number;
	baseOpacity: number;
	phase: number;
}

// Nébuleuses
interface Nebula {
	x: number;
	y: number;
	radius: number;
	color: string;
	phase: number;
}

// Planètes
interface Planet {
	x: number;
	y: number;
	radius: number;
	color1: string;
	color2: string;
}

// Œufs cosmiques en orbite
interface CosmicEgg {
	angle: number;
	distance: number;
	speed: number;
	size: number;
}

// Étoiles filantes
interface ShootingStar {
	x: number;
	y: number;
	vx: number;
	vy: number;
	length: number;
	opacity: number;
}

let stars: Star[] = [];
let nebulas: Nebula[] = [];
let planets: Planet[] = [];
let cosmicEggs: CosmicEgg[] = [];
let shootingStars: ShootingStar[] = [];
let stationRotation = 0;
let portalRotation = 0;
let solarPanelAngle = 0;

function initScene(width: number, height: number) {
	// Générer étoiles
	stars = Array.from({ length: 150 }, () => ({
		x: Math.random() * width,
		y: Math.random() * height,
		baseOpacity: 0.3 + Math.random() * 0.7,
		phase: Math.random() * Math.PI * 2
	}));

	// Générer nébuleuses
	nebulas = [
		{ x: width * 0.2, y: height * 0.3, radius: 60, color: '#9333ea', phase: 0 },
		{ x: width * 0.7, y: height * 0.6, radius: 80, color: '#3b82f6', phase: Math.PI },
		{ x: width * 0.5, y: height * 0.8, radius: 50, color: '#ec4899', phase: Math.PI * 0.5 }
	];

	// Générer planètes
	planets = [
		{ x: width * 0.15, y: height * 0.7, radius: 20, color1: '#7c3aed', color2: '#4c1d95' },
		{ x: width * 0.85, y: height * 0.25, radius: 25, color1: '#2563eb', color2: '#1e3a8a' }
	];

	// Générer œufs cosmiques (nombre basé sur productionRate)
	const eggCount = Math.max(3, Math.min(10, Math.floor(productionRate / 100) + 3));
	cosmicEggs = Array.from({ length: eggCount }, (_, i) => ({
		angle: (i / eggCount) * Math.PI * 2,
		distance: 60 + (i % 3) * 15,
		speed: 0.5 + (productionRate / 1000),
		size: 8 + Math.random() * 4
	}));

	shootingStars = [];
}

function drawBackground(width: number, height: number) {
	// Fond noir profond
	ctx.fillStyle = '#0a0a14';
	ctx.fillRect(0, 0, width, height);
}

function drawNebulas() {
	nebulas.forEach(nebula => {
		const pulse = Math.sin(time * 0.0005 + nebula.phase) * 0.2 + 0.8;
		const radiusAnimated = nebula.radius * pulse;

		const gradient = ctx.createRadialGradient(
			nebula.x, nebula.y, 0,
			nebula.x, nebula.y, radiusAnimated
		);
		
		gradient.addColorStop(0, nebula.color + '40');
		gradient.addColorStop(0.5, nebula.color + '20');
		gradient.addColorStop(1, nebula.color + '00');

		ctx.fillStyle = gradient;
		ctx.filter = 'blur(20px)';
		ctx.fillRect(
			nebula.x - radiusAnimated,
			nebula.y - radiusAnimated,
			radiusAnimated * 2,
			radiusAnimated * 2
		);
		ctx.filter = 'none';
	});
}

function drawStars() {
	stars.forEach(star => {
		const opacity = star.baseOpacity * (0.5 + Math.sin(time * 0.003 + star.phase) * 0.5);
		ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
		ctx.fillRect(star.x, star.y, 2, 2);
	});
}

function drawPlanets() {
	planets.forEach(planet => {
		const gradient = ctx.createRadialGradient(
			planet.x - planet.radius * 0.3,
			planet.y - planet.radius * 0.3,
			0,
			planet.x,
			planet.y,
			planet.radius
		);
		gradient.addColorStop(0, planet.color1);
		gradient.addColorStop(1, planet.color2);

		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
		ctx.fill();
	});
}

function drawSpaceStation(centerX: number, centerY: number) {
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(stationRotation);

	// Module central
	ctx.fillStyle = '#94a3b8';
	ctx.fillRect(-20, -15, 40, 30);
	ctx.strokeStyle = '#334155';
	ctx.lineWidth = 2;
	ctx.strokeRect(-20, -15, 40, 30);

	// Détails module
	ctx.fillStyle = '#3b82f6';
	ctx.fillRect(-15, -10, 8, 8);
	ctx.fillRect(7, -10, 8, 8);
	ctx.fillRect(-4, 2, 8, 8);

	// Panneaux solaires gauche
	ctx.save();
	ctx.translate(-30, 0);
	ctx.rotate(solarPanelAngle);
	ctx.fillStyle = '#1e3a8a';
	ctx.fillRect(-25, -8, 25, 16);
	ctx.strokeStyle = '#60a5fa';
	ctx.lineWidth = 1;
	ctx.strokeRect(-25, -8, 25, 16);
	// Lignes panneaux
	for (let i = -20; i < 0; i += 5) {
		ctx.beginPath();
		ctx.moveTo(i, -8);
		ctx.lineTo(i, 8);
		ctx.stroke();
	}
	ctx.restore();

	// Panneaux solaires droite
	ctx.save();
	ctx.translate(30, 0);
	ctx.rotate(-solarPanelAngle);
	ctx.fillStyle = '#1e3a8a';
	ctx.fillRect(0, -8, 25, 16);
	ctx.strokeStyle = '#60a5fa';
	ctx.lineWidth = 1;
	ctx.strokeRect(0, -8, 25, 16);
	// Lignes panneaux
	for (let i = 5; i < 25; i += 5) {
		ctx.beginPath();
		ctx.moveTo(i, -8);
		ctx.lineTo(i, 8);
		ctx.stroke();
	}
	ctx.restore();

	// Antenne
	ctx.strokeStyle = '#64748b';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, -15);
	ctx.lineTo(0, -25);
	ctx.stroke();
	ctx.fillStyle = '#ef4444';
	ctx.beginPath();
	ctx.arc(0, -25, 3, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();
}

function drawCosmicEggs(centerX: number, centerY: number) {
	cosmicEggs.forEach(egg => {
		const x = centerX + Math.cos(egg.angle) * egg.distance;
		const y = centerY + Math.sin(egg.angle) * egg.distance;

		// Glow
		const gradient = ctx.createRadialGradient(x, y, 0, x, y, egg.size * 2);
		gradient.addColorStop(0, '#fbbf2440');
		gradient.addColorStop(1, '#fbbf2400');
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, egg.size * 2, 0, Math.PI * 2);
		ctx.fill();

		// Œuf doré
		const eggGradient = ctx.createRadialGradient(
			x - egg.size * 0.3,
			y - egg.size * 0.3,
			0,
			x,
			y,
			egg.size
		);
		eggGradient.addColorStop(0, '#fef3c7');
		eggGradient.addColorStop(0.5, '#fbbf24');
		eggGradient.addColorStop(1, '#d97706');

		ctx.fillStyle = eggGradient;
		ctx.beginPath();
		ctx.ellipse(x, y, egg.size, egg.size * 1.2, 0, 0, Math.PI * 2);
		ctx.fill();

		// Reflet
		ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
		ctx.beginPath();
		ctx.ellipse(x - egg.size * 0.3, y - egg.size * 0.4, egg.size * 0.4, egg.size * 0.3, 0, 0, Math.PI * 2);
		ctx.fill();

		// Mettre à jour l'angle
		egg.angle += egg.speed * 0.01;
	});
}

function drawDimensionalPortal(x: number, y: number) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(portalRotation);

	const pulseSize = 30 + Math.sin(time * 0.002) * 5;

	// Spirale externe
	for (let i = 0; i < 6; i++) {
		const angle = (i / 6) * Math.PI * 2 + portalRotation * 2;
		const colors = ['#9333ea', '#3b82f6', '#ec4899'];
		const color = colors[i % colors.length];

		ctx.strokeStyle = color + '80';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(0, 0, pulseSize - i * 3, angle, angle + Math.PI * 0.5);
		ctx.stroke();
	}

	// Centre brillant
	const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
	centerGradient.addColorStop(0, '#ffffff');
	centerGradient.addColorStop(0.3, '#a855f7');
	centerGradient.addColorStop(1, '#581c8700');
	ctx.fillStyle = centerGradient;
	ctx.beginPath();
	ctx.arc(0, 0, 15, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();
}

function drawShootingStars() {
	shootingStars = shootingStars.filter(star => {
		star.x += star.vx;
		star.y += star.vy;
		star.opacity -= 0.015;

		if (star.opacity <= 0) return false;

		ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(star.x, star.y);
		ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length);
		ctx.stroke();

		return true;
	});

	// Ajouter occasionnellement une étoile filante
	if (Math.random() < 0.01) {
		shootingStars.push({
			x: Math.random() * canvas.width,
			y: -10,
			vx: (Math.random() - 0.5) * 4,
			vy: 3 + Math.random() * 3,
			length: 5 + Math.random() * 10,
			opacity: 1
		});
	}
}

function animate() {
	if (!ctx || !canvas) return;

	const width = canvas.width;
	const height = canvas.height;
	const centerX = width / 2;
	const centerY = height / 2;

	// Clear
	drawBackground(width, height);

	// Nébuleuses (arrière-plan)
	drawNebulas();

	// Planètes
	drawPlanets();

	// Étoiles
	drawStars();

	// Étoiles filantes
	drawShootingStars();

	// Portail dimensionnel
	drawDimensionalPortal(width * 0.85, height * 0.75);

	// Station spatiale
	drawSpaceStation(centerX, centerY);

	// Œufs cosmiques
	drawCosmicEggs(centerX, centerY);

	// Mettre à jour animations
	time += 16;
	stationRotation += 0.001;
	portalRotation += 0.02;
	solarPanelAngle = Math.sin(time * 0.001) * 0.3;

	animationId = requestAnimationFrame(animate);
}

function handleResize() {
	if (!canvas) return;
	const rect = canvas.parentElement?.getBoundingClientRect();
	if (rect) {
		canvas.width = rect.width;
		canvas.height = 180;
		initScene(canvas.width, canvas.height);
	}
}

onMount(() => {
	ctx = canvas.getContext('2d')!;
	handleResize();
	animate();

	window.addEventListener('resize', handleResize);
});

onDestroy(() => {
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
	window.removeEventListener('resize', handleResize);
});
</script>

<canvas bind:this={canvas} class="cosmic-scene"></canvas>

<style>
	.cosmic-scene {
		width: 100%;
		height: 180px;
		display: block;
		background: #0a0a14;
	}
</style>
