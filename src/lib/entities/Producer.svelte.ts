import Decimal from 'break_eternity.js';
import { calculateProducerCost, calculateProduction } from '../engine/formulas';

export class Producer {
	owned = $state(0);
	unlocked = $state(false);
	multiplier = $state(new Decimal(1));

	constructor(
		public id: string,
		public name: string,
		public emoji: string,
		public description: string,
		public baseCost: Decimal,
		public baseProduction: Decimal,
		public growthRate: number,
		public resourceProduced: string,
		public resourceCost: string
	) {}

	getCurrentCost(): Decimal {
		return calculateProducerCost(this.baseCost, this.growthRate, this.owned);
	}

	getProduction(): Decimal {
		return calculateProduction(this.baseProduction, this.owned, this.multiplier);
	}

	buy(count: number = 1): void {
		this.owned += count;
	}

	applyMultiplier(mult: Decimal): void {
		this.multiplier = this.multiplier.times(mult);
	}

	setMultiplier(mult: Decimal): void {
		this.multiplier = mult;
	}

	unlock(): void {
		this.unlocked = true;
	}

	hasAny(): boolean {
		return this.owned > 0;
	}
}
