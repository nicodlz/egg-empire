import Decimal from 'break_eternity.js';

export class Upgrade {
	purchased = $state(false);
	unlocked = $state(false);

	constructor(
		public id: string,
		public name: string,
		public description: string,
		public cost: Decimal,
		public resourceCost: string,
		public effect: () => void,
		public requirement?: () => boolean
	) {}

	purchase(): void {
		if (this.purchased) return;
		this.purchased = true;
		this.effect();
	}

	canPurchase(): boolean {
		if (this.purchased) return false;
		if (this.requirement && !this.requirement()) return false;
		return true;
	}

	requirementMet(): boolean {
		return !this.requirement || this.requirement();
	}

	unlock(): void {
		this.unlocked = true;
	}
}
