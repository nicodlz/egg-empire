import Decimal from 'break_eternity.js';
import { gameState } from './gameState.svelte';
import { Upgrade } from '../entities/Upgrade.svelte';
import { UPGRADES } from '../engine/constants';

/**
 * Initialize upgrades with their effects
 * This needs to be called after gameState is created
 */
export function initializeUpgrades() {
	// Better Hands - 2x click power
	const betterHands = new Upgrade(
		UPGRADES.BETTER_HANDS.id,
		UPGRADES.BETTER_HANDS.name,
		UPGRADES.BETTER_HANDS.description,
		UPGRADES.BETTER_HANDS.cost,
		UPGRADES.BETTER_HANDS.resourceCost,
		() => {
			gameState.clickPower = gameState.clickPower.times(2);
		}
	);
	betterHands.unlock();
	gameState.upgrades.set(betterHands.id, betterHands);

	// Selective Breeding - 2x chicken production
	const selectiveBreeding = new Upgrade(
		UPGRADES.SELECTIVE_BREEDING.id,
		UPGRADES.SELECTIVE_BREEDING.name,
		UPGRADES.SELECTIVE_BREEDING.description,
		UPGRADES.SELECTIVE_BREEDING.cost,
		UPGRADES.SELECTIVE_BREEDING.resourceCost,
		() => {
			const chicken = gameState.producers.get('chicken');
			if (chicken) {
				chicken.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const chicken = gameState.producers.get('chicken');
			return chicken ? chicken.owned > 0 : false;
		}
	);
	selectiveBreeding.unlock();
	gameState.upgrades.set(selectiveBreeding.id, selectiveBreeding);

	// Organic Label - 2x money from selling eggs (placeholder for now)
	const organicLabel = new Upgrade(
		UPGRADES.ORGANIC_LABEL.id,
		UPGRADES.ORGANIC_LABEL.name,
		UPGRADES.ORGANIC_LABEL.description,
		UPGRADES.ORGANIC_LABEL.cost,
		UPGRADES.ORGANIC_LABEL.resourceCost,
		() => {
			// Money mechanic not fully implemented yet
			console.log('Organic label purchased!');
		}
	);
	organicLabel.unlock();
	gameState.upgrades.set(organicLabel.id, organicLabel);

	// Heated Coops - 3x coop production
	const heatedCoops = new Upgrade(
		UPGRADES.HEATED_COOPS.id,
		UPGRADES.HEATED_COOPS.name,
		UPGRADES.HEATED_COOPS.description,
		UPGRADES.HEATED_COOPS.cost,
		UPGRADES.HEATED_COOPS.resourceCost,
		() => {
			const coop = gameState.producers.get('coop');
			if (coop) {
				coop.applyMultiplier(new Decimal(3));
			}
		},
		() => {
			const coop = gameState.producers.get('coop');
			return coop ? coop.owned > 0 : false;
		}
	);
	heatedCoops.unlock();
	gameState.upgrades.set(heatedCoops.id, heatedCoops);

	// Premium Feed - 1.5x all production
	const premiumFeed = new Upgrade(
		UPGRADES.PREMIUM_FEED.id,
		UPGRADES.PREMIUM_FEED.name,
		UPGRADES.PREMIUM_FEED.description,
		UPGRADES.PREMIUM_FEED.cost,
		UPGRADES.PREMIUM_FEED.resourceCost,
		() => {
			gameState.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.5));
				}
			});
		}
	);
	premiumFeed.unlock();
	gameState.upgrades.set(premiumFeed.id, premiumFeed);
}

/**
 * Click action - add eggs based on click power
 */
export function clickEgg() {
	const eggs = gameState.resources.get('eggs');
	if (eggs) {
		eggs.add(gameState.clickPower);
		gameState.totalClicks++;
		gameState.statistics.totalClicks++;
	}
}

/**
 * Buy a producer
 */
export function buyProducer(producerId: string, amount: number = 1) {
	const producer = gameState.producers.get(producerId);
	if (!producer || !producer.unlocked) return false;

	const resource = gameState.resources.get(producer.resourceCost);
	if (!resource) return false;

	const cost = producer.getCurrentCost();
	
	// For simplicity, buying multiples just multiplies the current cost
	// A more accurate implementation would use bulk cost calculation
	const totalCost = cost.times(amount);

	if (!resource.canAfford(totalCost)) {
		return false;
	}

	resource.subtract(totalCost);
	producer.buy(amount);

	return true;
}

/**
 * Buy an upgrade
 */
export function buyUpgrade(upgradeId: string) {
	const upgrade = gameState.upgrades.get(upgradeId);
	if (!upgrade || !upgrade.canPurchase()) return false;

	const resource = gameState.resources.get(upgrade.resourceCost);
	if (!resource) return false;

	if (!resource.canAfford(upgrade.cost)) {
		return false;
	}

	resource.subtract(upgrade.cost);
	upgrade.purchase();

	return true;
}

/**
 * Update game state based on delta time (called every tick)
 */
export function updateGame(deltaTime: number) {
	// Add production for each resource
	gameState.producers.forEach(producer => {
		if (!producer.unlocked) return;

		const production = producer.getProduction().times(deltaTime);
		const resource = gameState.resources.get(producer.resourceProduced);
		
		if (resource) {
			resource.add(production);
		}
	});

	// Check for phase unlocks
	checkPhaseUnlocks();
}

/**
 * Check and unlock new phases
 */
function checkPhaseUnlocks() {
	const eggsResource = gameState.resources.get('eggs');
	if (!eggsResource) return;

	const totalEggs = eggsResource.totalEarned;

	// Unlock Industrial phase
	const industrial = gameState.phases.get('industrial');
	if (industrial && !industrial.unlocked && totalEggs.gte(10000)) {
		unlockPhase('industrial');
	}

	// Unlock Biotech phase
	const biotech = gameState.phases.get('biotech');
	if (biotech && !biotech.unlocked && totalEggs.gte(1000000)) {
		unlockPhase('biotech');
	}

	// Unlock Cosmic phase
	const cosmic = gameState.phases.get('cosmic');
	if (cosmic && !cosmic.unlocked && totalEggs.gte(1000000000)) {
		unlockPhase('cosmic');
	}
}

/**
 * Unlock a new phase
 */
export function unlockPhase(phaseId: string) {
	const phase = gameState.phases.get(phaseId);
	if (!phase || phase.unlocked) return false;

	phase.unlocked = true;
	gameState.currentPhase = phaseId;

	// Unlock producers in this phase
	phase.producers.forEach(producerId => {
		const producer = gameState.producers.get(producerId);
		if (producer) {
			producer.unlock();
		}
	});

	// Unlock upgrades in this phase
	phase.upgrades.forEach(upgradeId => {
		const upgrade = gameState.upgrades.get(upgradeId);
		if (upgrade) {
			upgrade.unlock();
		}
	});

	return true;
}

/**
 * Calculate offline progress
 */
export function applyOfflineProgress(offlineSeconds: number, productionPerSecond: Decimal) {
	const eggs = gameState.resources.get('eggs');
	if (eggs) {
		const offlineProduction = productionPerSecond.times(offlineSeconds);
		eggs.add(offlineProduction);
	}
}
