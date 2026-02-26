import Decimal from 'break_eternity.js';
import { gameState } from './gameState.svelte';
import { calculateBulkCost } from '../engine/formulas';
import { Upgrade } from '../entities/Upgrade.svelte';
import { UPGRADES, HATCH_COST, HATCH_SUCCESS_RATE, SELL_PRICES, AUTO_HATCH_BASE_COST, AUTO_HATCH_GROWTH_RATE, AUTO_HATCH_INTERVAL, PHASE_THRESHOLDS } from '../engine/constants';
import { achievementManager, triggerAchievementCallback } from '../achievements/achievementManager';

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

	// INDUSTRIAL PHASE UPGRADES
	// Industrial Automation - 2x incubator production
	const industrialAutomation = new Upgrade(
		UPGRADES.INDUSTRIAL_AUTOMATION.id,
		UPGRADES.INDUSTRIAL_AUTOMATION.name,
		UPGRADES.INDUSTRIAL_AUTOMATION.description,
		UPGRADES.INDUSTRIAL_AUTOMATION.cost,
		UPGRADES.INDUSTRIAL_AUTOMATION.resourceCost,
		() => {
			const incubator = gameState.producers.get('incubator');
			if (incubator) {
				incubator.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const incubator = gameState.producers.get('incubator');
			return incubator ? incubator.owned > 0 : false;
		}
	);
	gameState.upgrades.set(industrialAutomation.id, industrialAutomation);

	// Quality Control - 2x factory production
	const qualityControl = new Upgrade(
		UPGRADES.QUALITY_CONTROL.id,
		UPGRADES.QUALITY_CONTROL.name,
		UPGRADES.QUALITY_CONTROL.description,
		UPGRADES.QUALITY_CONTROL.cost,
		UPGRADES.QUALITY_CONTROL.resourceCost,
		() => {
			const factory = gameState.producers.get('factory');
			if (factory) {
				factory.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const factory = gameState.producers.get('factory');
			return factory ? factory.owned > 0 : false;
		}
	);
	gameState.upgrades.set(qualityControl.id, qualityControl);

	// Efficient Clicks - 3x click power
	const efficientClicks = new Upgrade(
		UPGRADES.EFFICIENT_CLICKS.id,
		UPGRADES.EFFICIENT_CLICKS.name,
		UPGRADES.EFFICIENT_CLICKS.description,
		UPGRADES.EFFICIENT_CLICKS.cost,
		UPGRADES.EFFICIENT_CLICKS.resourceCost,
		() => {
			gameState.clickPower = gameState.clickPower.times(3);
		}
	);
	gameState.upgrades.set(efficientClicks.id, efficientClicks);

	// Mass Production - 1.5x all production
	const massProduction = new Upgrade(
		UPGRADES.MASS_PRODUCTION.id,
		UPGRADES.MASS_PRODUCTION.name,
		UPGRADES.MASS_PRODUCTION.description,
		UPGRADES.MASS_PRODUCTION.cost,
		UPGRADES.MASS_PRODUCTION.resourceCost,
		() => {
			gameState.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.5));
				}
			});
		}
	);
	gameState.upgrades.set(massProduction.id, massProduction);

	// Robotics - 3x conveyor belt production
	const robotics = new Upgrade(
		UPGRADES.ROBOTICS.id,
		UPGRADES.ROBOTICS.name,
		UPGRADES.ROBOTICS.description,
		UPGRADES.ROBOTICS.cost,
		UPGRADES.ROBOTICS.resourceCost,
		() => {
			const conveyorBelt = gameState.producers.get('conveyor_belt');
			if (conveyorBelt) {
				conveyorBelt.applyMultiplier(new Decimal(3));
			}
		},
		() => {
			const conveyorBelt = gameState.producers.get('conveyor_belt');
			return conveyorBelt ? conveyorBelt.owned > 0 : false;
		}
	);
	gameState.upgrades.set(robotics.id, robotics);

	// BIOTECH PHASE UPGRADES
	// Genetic Enhancement - 2x DNA sequencer production
	const geneticEnhancement = new Upgrade(
		UPGRADES.GENETIC_ENHANCEMENT.id,
		UPGRADES.GENETIC_ENHANCEMENT.name,
		UPGRADES.GENETIC_ENHANCEMENT.description,
		UPGRADES.GENETIC_ENHANCEMENT.cost,
		UPGRADES.GENETIC_ENHANCEMENT.resourceCost,
		() => {
			const dnaSequencer = gameState.producers.get('dna_sequencer');
			if (dnaSequencer) {
				dnaSequencer.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const dnaSequencer = gameState.producers.get('dna_sequencer');
			return dnaSequencer ? dnaSequencer.owned > 0 : false;
		}
	);
	gameState.upgrades.set(geneticEnhancement.id, geneticEnhancement);

	// CRISPR Tech - 2x gene lab production
	const crisprTech = new Upgrade(
		UPGRADES.CRISPR_TECH.id,
		UPGRADES.CRISPR_TECH.name,
		UPGRADES.CRISPR_TECH.description,
		UPGRADES.CRISPR_TECH.cost,
		UPGRADES.CRISPR_TECH.resourceCost,
		() => {
			const geneLab = gameState.producers.get('gene_lab');
			if (geneLab) {
				geneLab.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const geneLab = gameState.producers.get('gene_lab');
			return geneLab ? geneLab.owned > 0 : false;
		}
	);
	gameState.upgrades.set(crisprTech.id, crisprTech);

	// Synthetic Biology - 1.5x all production
	const syntheticBiology = new Upgrade(
		UPGRADES.SYNTHETIC_BIOLOGY.id,
		UPGRADES.SYNTHETIC_BIOLOGY.name,
		UPGRADES.SYNTHETIC_BIOLOGY.description,
		UPGRADES.SYNTHETIC_BIOLOGY.cost,
		UPGRADES.SYNTHETIC_BIOLOGY.resourceCost,
		() => {
			gameState.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.5));
				}
			});
		}
	);
	gameState.upgrades.set(syntheticBiology.id, syntheticBiology);

	// Quantum DNA - 3x bioprinter production
	const quantumDna = new Upgrade(
		UPGRADES.QUANTUM_DNA.id,
		UPGRADES.QUANTUM_DNA.name,
		UPGRADES.QUANTUM_DNA.description,
		UPGRADES.QUANTUM_DNA.cost,
		UPGRADES.QUANTUM_DNA.resourceCost,
		() => {
			const bioprinter = gameState.producers.get('bioprinter');
			if (bioprinter) {
				bioprinter.applyMultiplier(new Decimal(3));
			}
		},
		() => {
			const bioprinter = gameState.producers.get('bioprinter');
			return bioprinter ? bioprinter.owned > 0 : false;
		}
	);
	gameState.upgrades.set(quantumDna.id, quantumDna);

	// Super Clicks - 5x click power
	const superClicks = new Upgrade(
		UPGRADES.SUPER_CLICKS.id,
		UPGRADES.SUPER_CLICKS.name,
		UPGRADES.SUPER_CLICKS.description,
		UPGRADES.SUPER_CLICKS.cost,
		UPGRADES.SUPER_CLICKS.resourceCost,
		() => {
			gameState.clickPower = gameState.clickPower.times(5);
		}
	);
	gameState.upgrades.set(superClicks.id, superClicks);

	// COSMIC PHASE UPGRADES
	// Zero-G Optimization - 2x space station production
	const zeroGOptimization = new Upgrade(
		UPGRADES.ZERO_G_OPTIMIZATION.id,
		UPGRADES.ZERO_G_OPTIMIZATION.name,
		UPGRADES.ZERO_G_OPTIMIZATION.description,
		UPGRADES.ZERO_G_OPTIMIZATION.cost,
		UPGRADES.ZERO_G_OPTIMIZATION.resourceCost,
		() => {
			const spaceStation = gameState.producers.get('space_station');
			if (spaceStation) {
				spaceStation.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const spaceStation = gameState.producers.get('space_station');
			return spaceStation ? spaceStation.owned > 0 : false;
		}
	);
	gameState.upgrades.set(zeroGOptimization.id, zeroGOptimization);

	// Lunar Efficiency - 2x moon colony production
	const lunarEfficiency = new Upgrade(
		UPGRADES.LUNAR_EFFICIENCY.id,
		UPGRADES.LUNAR_EFFICIENCY.name,
		UPGRADES.LUNAR_EFFICIENCY.description,
		UPGRADES.LUNAR_EFFICIENCY.cost,
		UPGRADES.LUNAR_EFFICIENCY.resourceCost,
		() => {
			const moonColony = gameState.producers.get('moon_colony');
			if (moonColony) {
				moonColony.applyMultiplier(new Decimal(2));
			}
		},
		() => {
			const moonColony = gameState.producers.get('moon_colony');
			return moonColony ? moonColony.owned > 0 : false;
		}
	);
	gameState.upgrades.set(lunarEfficiency.id, lunarEfficiency);

	// Stellar Power - 3x dyson sphere production
	const stellarPower = new Upgrade(
		UPGRADES.STELLAR_POWER.id,
		UPGRADES.STELLAR_POWER.name,
		UPGRADES.STELLAR_POWER.description,
		UPGRADES.STELLAR_POWER.cost,
		UPGRADES.STELLAR_POWER.resourceCost,
		() => {
			const dysonSphere = gameState.producers.get('dyson_sphere');
			if (dysonSphere) {
				dysonSphere.applyMultiplier(new Decimal(3));
			}
		},
		() => {
			const dysonSphere = gameState.producers.get('dyson_sphere');
			return dysonSphere ? dysonSphere.owned > 0 : false;
		}
	);
	gameState.upgrades.set(stellarPower.id, stellarPower);

	// Interdimensional Boost - 1.5x all production
	const interdimensionalBoost = new Upgrade(
		UPGRADES.INTERDIMENSIONAL_BOOST.id,
		UPGRADES.INTERDIMENSIONAL_BOOST.name,
		UPGRADES.INTERDIMENSIONAL_BOOST.description,
		UPGRADES.INTERDIMENSIONAL_BOOST.cost,
		UPGRADES.INTERDIMENSIONAL_BOOST.resourceCost,
		() => {
			gameState.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.5));
				}
			});
		}
	);
	gameState.upgrades.set(interdimensionalBoost.id, interdimensionalBoost);

	// Cosmic Clicks - 10x click power
	const cosmicClicks = new Upgrade(
		UPGRADES.COSMIC_CLICKS.id,
		UPGRADES.COSMIC_CLICKS.name,
		UPGRADES.COSMIC_CLICKS.description,
		UPGRADES.COSMIC_CLICKS.cost,
		UPGRADES.COSMIC_CLICKS.resourceCost,
		() => {
			gameState.clickPower = gameState.clickPower.times(10);
		}
	);
	gameState.upgrades.set(cosmicClicks.id, cosmicClicks);
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
 * Try to hatch an egg into a chicken
 * Returns true if a chicken was born
 */
export function hatchEgg(): boolean {
	const eggs = gameState.resources.get('eggs');
	if (!eggs || !eggs.canAfford(HATCH_COST)) return false;

	eggs.subtract(HATCH_COST);

	const success = Math.random() < HATCH_SUCCESS_RATE;
	if (success) {
		const chicken = gameState.producers.get('chicken');
		if (chicken) {
			chicken.owned += 1;
		}
	}
	return success;
}

/**
 * Sell eggs for money
 */
export function sellEggs(amount: number): boolean {
	const eggs = gameState.resources.get('eggs');
	const money = gameState.resources.get('money');
	if (!eggs || !money) return false;

	const cost = new Decimal(amount);
	if (!eggs.canAfford(cost)) return false;

	eggs.subtract(cost);
	money.add(SELL_PRICES.EGG.times(amount));
	return true;
}

/**
 * Sell chickens for money
 */
export function sellChickens(amount: number): boolean {
	const chicken = gameState.producers.get('chicken');
	const money = gameState.resources.get('money');
	if (!chicken || !money) return false;

	if (chicken.owned < amount) return false;

	chicken.owned -= amount;
	money.add(SELL_PRICES.CHICKEN.times(amount));
	return true;
}

/**
 * Buy an auto-hatcher (costs money)
 */
export function buyAutoHatch(): boolean {
	const money = gameState.resources.get('money');
	if (!money) return false;

	const cost = AUTO_HATCH_BASE_COST.times(Math.pow(AUTO_HATCH_GROWTH_RATE, gameState.autoHatchCount));
	if (!money.canAfford(cost)) return false;

	money.subtract(cost);
	gameState.autoHatchCount++;
	return true;
}

/**
 * Get current auto-hatch cost
 */
export function getAutoHatchCost(): Decimal {
	return AUTO_HATCH_BASE_COST.times(Math.pow(AUTO_HATCH_GROWTH_RATE, gameState.autoHatchCount));
}

/**
 * Buy a producer
 */
export function buyProducer(producerId: string, amount: number = 1) {
	const producer = gameState.producers.get(producerId);
	if (!producer || !producer.unlocked) return false;

	const resource = gameState.resources.get(producer.resourceCost);
	if (!resource) return false;

	const totalCost = calculateBulkCost(
		producer.baseCost,
		producer.growthRate,
		producer.owned,
		amount
	);

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
	// Calculate chicken boost from all buildings
	let chickenBoost = new Decimal(1);
	gameState.producers.forEach(producer => {
		if (!producer.unlocked || producer.resourceProduced !== 'chicken_boost') return;
		if (producer.owned <= 0) return;
		// Each owned building adds its production as a multiplier
		chickenBoost = chickenBoost.plus(producer.getProduction());
	});

	// Only chickens produce eggs, multiplied by boost
	const chicken = gameState.producers.get('chicken');
	if (chicken && chicken.owned > 0) {
		const baseEggs = chicken.getProduction().times(chickenBoost).times(deltaTime);
		const eggs = gameState.resources.get('eggs');
		if (eggs) eggs.add(baseEggs);
	}

	// Auto-hatch
	if (gameState.autoHatchCount > 0) {
		gameState.autoHatchTimer += deltaTime;
		const interval = AUTO_HATCH_INTERVAL / gameState.autoHatchCount;
		while (gameState.autoHatchTimer >= interval) {
			gameState.autoHatchTimer -= interval;
			const eggs = gameState.resources.get('eggs');
			if (eggs && eggs.canAfford(HATCH_COST)) {
				eggs.subtract(HATCH_COST);
				if (Math.random() < HATCH_SUCCESS_RATE) {
					const chicken = gameState.producers.get('chicken');
					if (chicken) chicken.owned += 1;
				}
			}
		}
	}

	// Check for phase unlocks
	checkPhaseUnlocks();

	// Check for achievements
	const newAchievements = achievementManager.check(gameState);
	triggerAchievementCallback(newAchievements);
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
	if (
		industrial &&
		!industrial.unlocked &&
		totalEggs.gte(PHASE_THRESHOLDS.INDUSTRIAL)
	) {
		unlockPhase('industrial');
	}

	// Unlock Biotech phase
	const biotech = gameState.phases.get('biotech');
	if (
		biotech &&
		!biotech.unlocked &&
		totalEggs.gte(PHASE_THRESHOLDS.BIOTECH)
	) {
		unlockPhase('biotech');
	}

	// Unlock Cosmic phase
	const cosmic = gameState.phases.get('cosmic');
	if (
		cosmic &&
		!cosmic.unlocked &&
		totalEggs.gte(PHASE_THRESHOLDS.COSMIC)
	) {
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
	gameState.phases.set(phaseId, { ...phase }); // trigger SvelteMap reactivity
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
