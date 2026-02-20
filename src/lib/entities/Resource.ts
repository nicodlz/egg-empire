import Decimal from 'break_eternity.js';

export class Resource {
	amount: Decimal;
	totalEarned: Decimal;

	constructor(
		public id: string,
		public name: string,
		public displayOrder: number = 0
	) {
		this.amount = new Decimal(0);
		this.totalEarned = new Decimal(0);
	}

	/**
	 * Add to resource amount
	 */
	add(value: Decimal): void {
		this.amount = this.amount.plus(value);
		this.totalEarned = this.totalEarned.plus(value);
	}

	/**
	 * Subtract from resource amount (returns true if successful)
	 */
	subtract(value: Decimal): boolean {
		if (this.amount.lt(value)) {
			return false;
		}
		this.amount = this.amount.minus(value);
		return true;
	}

	/**
	 * Check if can afford a cost
	 */
	canAfford(cost: Decimal): boolean {
		return this.amount.gte(cost);
	}

	/**
	 * Set amount directly
	 */
	set(value: Decimal): void {
		this.amount = value;
	}

	/**
	 * Reset to zero
	 */
	reset(): void {
		this.amount = new Decimal(0);
	}

	/**
	 * Reset including total earned
	 */
	hardReset(): void {
		this.amount = new Decimal(0);
		this.totalEarned = new Decimal(0);
	}
}
