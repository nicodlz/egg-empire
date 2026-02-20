<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		productionRate: number;
	}

	let { productionRate = 1 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;

	// Particle system for bubbles
	interface Bubble {
		x: number;
		y: number;
		radius: number;
		speed: number;
		tubeIndex: number;
	}

	let bubbles: Bubble[] = [];
	let time = 0;
	let glowPhase = 0;
	let dnaSpin = 0;
	let oscilloscopeData: number[] = [];
	let lightningTimer = 0;
	let showLightning = false;
	let lightningPoints: { x: number; y: number }[] = [];

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Initialize bubbles
		for (let i = 0; i < 30; i++) {
			bubbles.push(createBubble());
		}

		// Initialize oscilloscope data
		for (let i = 0; i < 100; i++) {
			oscilloscopeData.push(Math.sin(i * 0.1) * 10);
		}

		function createBubble(): Bubble {
			return {
				x: 0,
				y: Math.random() * 180,
				radius: 2 + Math.random() * 4,
				speed: 0.3 + Math.random() * 0.5,
				tubeIndex: Math.floor(Math.random() * 5)
			};
		}

		function animate() {
			const width = canvas.width;
			const height = 180;
			canvas.height = height;

			ctx.clearRect(0, 0, width, height);

			// === BACKGROUND ===
			// Floor tiles
			ctx.fillStyle = '#e8f4f8';
			ctx.fillRect(0, 0, width, height);

			// Draw tiles pattern
			ctx.strokeStyle = '#d0e8f0';
			ctx.lineWidth = 1;
			const tileSize = 20;
			for (let x = 0; x < width; x += tileSize) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y < height; y += tileSize) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			// Wall panels
			ctx.fillStyle = '#f5f9fb';
			ctx.fillRect(0, 0, width, 60);

			// === TUBES (5 tubes across the width) ===
			const tubePositions = [];
			const tubeCount = 5;
			const tubeWidth = 40;
			const tubeHeight = 140;
			const spacing = (width - tubeCount * tubeWidth) / (tubeCount + 1);

			for (let i = 0; i < tubeCount; i++) {
				const x = spacing + i * (tubeWidth + spacing);
				const y = 30;
				tubePositions.push({ x, y, width: tubeWidth, height: tubeHeight });

				// Liquid with wave effect
				const liquidHeight = tubeHeight - 20;
				const waveOffset = Math.sin(time * 0.02 + i) * 3;

				// Gradient for liquid
				const gradient = ctx.createLinearGradient(x, y, x, y + liquidHeight);
				if (i === 2) {
					// Center tube - green
					gradient.addColorStop(0, 'rgba(0, 255, 100, 0.6)');
					gradient.addColorStop(1, 'rgba(0, 200, 80, 0.8)');
				} else {
					// Side tubes - blue
					gradient.addColorStop(0, 'rgba(0, 150, 255, 0.5)');
					gradient.addColorStop(1, 'rgba(0, 100, 200, 0.7)');
				}

				ctx.fillStyle = gradient;
				ctx.fillRect(x + 5, y + 20 + waveOffset, tubeWidth - 10, liquidHeight);

				// Tube glass outline
				ctx.strokeStyle = 'rgba(200, 220, 240, 0.8)';
				ctx.lineWidth = 3;
				ctx.strokeRect(x, y, tubeWidth, tubeHeight);

				// Glass shine
				ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
				ctx.fillRect(x + 2, y + 5, 8, tubeHeight - 10);
			}

			// === CENTRAL EGG (in middle tube) ===
			const centerTube = tubePositions[2];
			const eggX = centerTube.x + centerTube.width / 2;
			const eggY = centerTube.y + centerTube.height / 2;
			const eggWidth = 25;
			const eggHeight = 32;

			// Pulsing glow
			glowPhase += 0.03 * productionRate;
			const glowIntensity = (Math.sin(glowPhase) + 1) / 2;
			const glowSize = 15 + glowIntensity * 10;

			ctx.shadowBlur = glowSize;
			ctx.shadowColor = '#00ff88';

			// Egg body
			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.ellipse(eggX, eggY, eggWidth / 2, eggHeight / 2, 0, 0, Math.PI * 2);
			ctx.fill();

			// Egg highlight
			ctx.shadowBlur = 0;
			ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
			ctx.beginPath();
			ctx.ellipse(eggX - 5, eggY - 8, 6, 10, 0, 0, Math.PI * 2);
			ctx.fill();

			// === DNA HELIX (left side) ===
			const dnaX = 50;
			const dnaY = 100;
			dnaSpin += 0.02 * productionRate;

			for (let i = 0; i < 20; i++) {
				const angle1 = dnaSpin + i * 0.3;
				const angle2 = angle1 + Math.PI;
				const yOffset = i * 6 - 60;

				// Strand 1
				const x1 = dnaX + Math.cos(angle1) * 15;
				const y1 = dnaY + yOffset;

				ctx.fillStyle = '#ff00ff';
				ctx.beginPath();
				ctx.arc(x1, y1, 3, 0, Math.PI * 2);
				ctx.fill();

				// Strand 2
				const x2 = dnaX + Math.cos(angle2) * 15;
				const y2 = dnaY + yOffset;

				ctx.fillStyle = '#00ffff';
				ctx.beginPath();
				ctx.arc(x2, y2, 3, 0, Math.PI * 2);
				ctx.fill();

				// Connection line
				if (Math.abs(Math.cos(angle1)) < 0.3) {
					ctx.strokeStyle = 'rgba(150, 150, 255, 0.5)';
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				}
			}

			// === OSCILLOSCOPE SCREEN (right side) ===
			const screenX = width - 120;
			const screenY = 40;
			const screenWidth = 100;
			const screenHeight = 60;

			// Screen background
			ctx.fillStyle = '#001a1a';
			ctx.fillRect(screenX, screenY, screenWidth, screenHeight);

			// Screen border
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 3;
			ctx.strokeRect(screenX, screenY, screenWidth, screenHeight);

			// Oscilloscope line
			oscilloscopeData.shift();
			oscilloscopeData.push(
				Math.sin(time * 0.1 * productionRate) * 15 + Math.random() * 5 - 2.5
			);

			ctx.strokeStyle = '#00ff00';
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let i = 0; i < oscilloscopeData.length; i++) {
				const x = screenX + (i / oscilloscopeData.length) * screenWidth;
				const y = screenY + screenHeight / 2 + oscilloscopeData[i];
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			// === BUBBLES ===
			ctx.shadowBlur = 0;
			bubbles.forEach((bubble, index) => {
				if (bubble.tubeIndex < tubePositions.length) {
					const tube = tubePositions[bubble.tubeIndex];
					const actualX = tube.x + 5 + bubble.x * (tube.width - 10);
					const actualY = tube.y + 20 + bubble.y;

					// Move bubble up
					bubble.y -= bubble.speed * productionRate;

					// Reset if out of tube
					if (bubble.y < 0) {
						bubble.y = tube.height - 20;
						bubble.x = Math.random();
					}

					// Draw bubble
					ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.arc(actualX, actualY, bubble.radius, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();

					// Bubble highlight
					ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
					ctx.beginPath();
					ctx.arc(actualX - 1, actualY - 1, bubble.radius * 0.4, 0, Math.PI * 2);
					ctx.fill();
				}
			});

			// === LIGHTNING ===
			lightningTimer++;
			if (lightningTimer > 100 / productionRate) {
				if (Math.random() < 0.1) {
					showLightning = true;
					lightningTimer = 0;

					// Generate lightning path
					const startX = tubePositions[1].x + tubePositions[1].width / 2;
					const startY = tubePositions[1].y;
					const endX = tubePositions[3].x + tubePositions[3].width / 2;
					const endY = tubePositions[3].y;

					lightningPoints = [{ x: startX, y: startY }];
					const segments = 8;
					for (let i = 1; i < segments; i++) {
						const t = i / segments;
						lightningPoints.push({
							x: startX + (endX - startX) * t + (Math.random() - 0.5) * 30,
							y: startY + (endY - startY) * t + (Math.random() - 0.5) * 20
						});
					}
					lightningPoints.push({ x: endX, y: endY });
				}
			}

			if (showLightning) {
				ctx.strokeStyle = '#00ffff';
				ctx.lineWidth = 2;
				ctx.shadowBlur = 10;
				ctx.shadowColor = '#00ffff';
				ctx.beginPath();
				lightningPoints.forEach((point, i) => {
					if (i === 0) ctx.moveTo(point.x, point.y);
					else ctx.lineTo(point.x, point.y);
				});
				ctx.stroke();
				ctx.shadowBlur = 0;

				if (lightningTimer > 3) {
					showLightning = false;
				}
			}

			time++;
			animationId = requestAnimationFrame(animate);
		}

		// Handle resize
		function resize() {
			if (canvas.offsetWidth > 0) canvas.width = canvas.offsetWidth;
		}

		// Wait a tick for layout in conditional blocks
		requestAnimationFrame(() => {
			resize();
			animate();
		});
		window.addEventListener('resize', resize);

		return () => {
			window.removeEventListener('resize', resize);
		};
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<canvas bind:this={canvas} class="biotech-lab"></canvas>

<style>
	.biotech-lab {
		width: 100%;
		height: 180px;
		display: block;
		image-rendering: crisp-edges;
	}
</style>
