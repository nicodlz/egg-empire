import Decimal from 'break_eternity.js';
import { calculateProducerCost, calculateProduction } from '../engine/formulas';

export class Producer {
	owned: number = 0;
	unlocked: boolean = false;
	multiplier: Decimal;

	constructor(
		public id: string,
		public name: string,
		public description: string,
		public baseCost: Decimal,
		public baseProduction: Decimal,
		public growthRate: number,
		public resourceProduced: string,
		public resourceCost: string
	) {
		this.multiplier = new Decimal(1);
	}

	/**
	 * Get current cost to buy one
	 */
	getCurrentCost(): Decimal {
		return calculateProducerCost(this.baseCost, this.growthRate, this.owned);
	}

	/**
	 * Get production per second
	 */
	getProduction(): Decimal {
		return calculateProduction(this.baseProduction, this.owned, this.multiplier);
	}

	/**
	 * Buy one producer
	 */
	buy(count: number = 1): void {
		this.owned += count;
	}

	/**
	 * Apply a multiplier to this producer
	 */
	applyMultiplier(mult: Decimal): void {
		this.multiplier = this.multiplier.times(mult);
	}

	/**
	 * Set multiplier directly
	 */
	setMultiplier(mult: Decimal): void {
		this.multiplier = mult;
	}

	/**
	 * Unlock this producer
	 */
	unlock(): void {
		this.unlocked = true;
	}

	/**
	 * Check if owned any
	 */
	hasAny(): boolean {
		return this.owned > 0;
	}
}
