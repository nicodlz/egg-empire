import Decimal from 'break_eternity.js';

export class Resource {
	amount = $state(new Decimal(0));
	totalEarned = $state(new Decimal(0));

	constructor(
		public id: string,
		public name: string,
		public displayOrder: number = 0
	) {}

	add(value: Decimal): void {
		this.amount = this.amount.plus(value);
		this.totalEarned = this.totalEarned.plus(value);
	}

	subtract(value: Decimal): boolean {
		if (this.amount.lt(value)) {
			return false;
		}
		this.amount = this.amount.minus(value);
		return true;
	}

	canAfford(cost: Decimal): boolean {
		return this.amount.gte(cost);
	}

	set(value: Decimal): void {
		this.amount = value;
	}

	reset(): void {
		this.amount = new Decimal(0);
	}

	hardReset(): void {
		this.amount = new Decimal(0);
		this.totalEarned = new Decimal(0);
	}
}
