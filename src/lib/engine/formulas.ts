import Decimal from 'break_eternity.js';

/**
 * Calculate the cost of buying a producer
 * Formula: baseCost * growthRate^owned
 */
export function calculateProducerCost(
	baseCost: Decimal,
	growthRate: number,
	owned: number
): Decimal {
	return baseCost.times(Decimal.pow(growthRate, owned));
}

/**
 * Calculate the cost of buying N producers at once
 * Formula: Sum of geometric series
 */
export function calculateBulkCost(
	baseCost: Decimal,
	growthRate: number,
	owned: number,
	amount: number
): Decimal {
	if (amount === 1) {
		return calculateProducerCost(baseCost, growthRate, owned);
	}

	const r = new Decimal(growthRate);
	const current = baseCost.times(Decimal.pow(growthRate, owned));
	
	// Sum = current * (r^n - 1) / (r - 1)
	const numerator = r.pow(amount).minus(1);
	const denominator = r.minus(1);
	
	return current.times(numerator.div(denominator));
}

/**
 * Calculate how many producers can be bought with current resources
 */
export function calculateMaxAffordable(
	baseCost: Decimal,
	growthRate: number,
	owned: number,
	availableResources: Decimal
): number {
	if (availableResources.lt(calculateProducerCost(baseCost, growthRate, owned))) {
		return 0;
	}

	let count = 0;
	const maxIterations = 1000;
	
	while (count < maxIterations) {
		const cost = calculateBulkCost(baseCost, growthRate, owned, count + 1);
		if (cost.gt(availableResources)) {
			break;
		}
		count++;
	}

	return count;
}

/**
 * Calculate production rate for a producer
 * Formula: baseProduction * owned * multiplier
 */
export function calculateProduction(
	baseProduction: Decimal,
	owned: number,
	multiplier: Decimal
): Decimal {
	return baseProduction.times(owned).times(multiplier);
}

/**
 * Format a Decimal number for display
 */
export function formatNumber(value: Decimal): string {
	if (value.lt(1000)) {
		return value.toFixed(2);
	}
	
	if (value.lt(1000000)) {
		return value.div(1000).toFixed(2) + 'K';
	}
	
	if (value.lt(1000000000)) {
		return value.div(1000000).toFixed(2) + 'M';
	}
	
	if (value.lt(1000000000000)) {
		return value.div(1000000000).toFixed(2) + 'B';
	}
	
	if (value.lt(1e15)) {
		return value.div(1e12).toFixed(2) + 'T';
	}

	// Scientific notation for very large numbers
	return value.toExponential(2);
}

/**
 * Format production rate (per second)
 */
export function formatRate(rate: Decimal): string {
	return formatNumber(rate) + '/s';
}

/**
 * Calculate offline progress
 * Caps at MAX_OFFLINE_TIME to prevent abuse
 */
export function calculateOfflineProgress(
	productionPerSecond: Decimal,
	offlineMs: number,
	maxOfflineMs: number
): Decimal {
	const cappedMs = Math.min(offlineMs, maxOfflineMs);
	const seconds = cappedMs / 1000;
	return productionPerSecond.times(seconds);
}

/**
 * Calculate prestige currency gain
 */
export function calculatePrestigeGain(totalEggs: Decimal): Decimal {
	if (totalEggs.lt(1000000000)) {
		return new Decimal(0);
	}
	
	// Prestige formula: sqrt(totalEggs / 1B)
	return totalEggs.div(1000000000).sqrt().floor();
}

/**
 * Apply prestige multiplier
 */
export function calculatePrestigeMultiplier(cosmicEggs: Decimal): Decimal {
	// Each cosmic egg gives 10% bonus
	return cosmicEggs.times(0.1).plus(1);
}

/**
 * Format time duration
 */
export function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ${hours % 24}h`;
	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
	return `${seconds}s`;
}
