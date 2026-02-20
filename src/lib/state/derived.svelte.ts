import Decimal from 'break_eternity.js';
import { gameState } from './gameState.svelte';
import { PHASE_THRESHOLDS } from '../engine/constants';

/**
 * Derived computations using getter functions
 * These automatically access current gameState values
 */

/**
 * Total eggs production per second
 */
export function getTotalEggsPerSecond(): Decimal {
	let total = new Decimal(0);
	
	gameState.producers.forEach(producer => {
		if (producer.resourceProduced === 'eggs' && producer.unlocked) {
			total = total.plus(producer.getProduction());
		}
	});
	
	return total;
}

/**
 * Total production per second for each resource
 */
export function getProductionRates(): Map<string, Decimal> {
	const rates = new Map<string, Decimal>();
	
	gameState.resources.forEach((_, resourceId) => {
		let total = new Decimal(0);
		
		gameState.producers.forEach(producer => {
			if (producer.resourceProduced === resourceId && producer.unlocked) {
				total = total.plus(producer.getProduction());
			}
		});
		
		rates.set(resourceId, total);
	});
	
	return rates;
}

/**
 * Check which producers are affordable
 */
export function getAffordableProducers(): Set<string> {
	const affordable = new Set<string>();
	
	gameState.producers.forEach(producer => {
		if (!producer.unlocked) return;
		
		const resource = gameState.resources.get(producer.resourceCost);
		if (resource && resource.canAfford(producer.getCurrentCost())) {
			affordable.add(producer.id);
		}
	});
	
	return affordable;
}

/**
 * Check which upgrades are affordable
 */
export function getAffordableUpgrades(): Set<string> {
	const affordable = new Set<string>();
	
	gameState.upgrades.forEach(upgrade => {
		if (!upgrade.unlocked || upgrade.purchased) return;
		
		const resource = gameState.resources.get(upgrade.resourceCost);
		if (resource && resource.canAfford(upgrade.cost)) {
			affordable.add(upgrade.id);
		}
	});
	
	return affordable;
}

/**
 * Check if next phase should unlock
 */
export function getShouldUnlockPhase(): string | null {
	const eggsResource = gameState.resources.get('eggs');
	if (!eggsResource) return null;

	const totalEggs = eggsResource.totalEarned;

	// Check Industrial phase
	if (!gameState.phases.get('industrial')?.unlocked) {
		if (totalEggs.gte(PHASE_THRESHOLDS.INDUSTRIAL)) {
			return 'industrial';
		}
	}

	// Check Biotech phase
	if (!gameState.phases.get('biotech')?.unlocked) {
		if (totalEggs.gte(PHASE_THRESHOLDS.BIOTECH)) {
			return 'biotech';
		}
	}

	// Check Cosmic phase
	if (!gameState.phases.get('cosmic')?.unlocked) {
		if (totalEggs.gte(PHASE_THRESHOLDS.COSMIC)) {
			return 'cosmic';
		}
	}

	return null;
}

/**
 * Get current phase data
 */
export function getCurrentPhase() {
	return gameState.phases.get(gameState.currentPhase);
}

/**
 * Get all unlocked producers in current phase
 */
export function getCurrentPhaseProducers() {
	const phase = getCurrentPhase();
	if (!phase) return [];

	return phase.producers
		.map(id => gameState.producers.get(id))
		.filter(p => p && p.unlocked);
}

/**
 * Get all available upgrades in current phase
 */
export function getCurrentPhaseUpgrades() {
	const phase = getCurrentPhase();
	if (!phase) return [];

	return phase.upgrades
		.map(id => gameState.upgrades.get(id))
		.filter(u => u && u.unlocked && !u.purchased);
}

/**
 * Progress to next phase (percentage)
 */
export function getPhaseProgress(): number {
	const eggsResource = gameState.resources.get('eggs');
	if (!eggsResource) return 0;

	const totalEggs = eggsResource.totalEarned;
	const currentPhaseId = gameState.currentPhase;

	// Determine next threshold
	let nextThreshold: Decimal;
	switch (currentPhaseId) {
		case 'artisanal':
			nextThreshold = PHASE_THRESHOLDS.INDUSTRIAL;
			break;
		case 'industrial':
			nextThreshold = PHASE_THRESHOLDS.BIOTECH;
			break;
		case 'biotech':
			nextThreshold = PHASE_THRESHOLDS.COSMIC;
			break;
		default:
			return 100; // Max phase reached
	}

	const progress = totalEggs.div(nextThreshold).times(100);
	return Math.min(progress.toNumber(), 100);
}
