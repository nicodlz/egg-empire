import Decimal from 'break_eternity.js';

export class Upgrade {
	purchased: boolean = false;
	unlocked: boolean = false;

	constructor(
		public id: string,
		public name: string,
		public description: string,
		public cost: Decimal,
		public resourceCost: string,
		public effect: () => void,
		public requirement?: () => boolean
	) {}

	/**
	 * Purchase this upgrade
	 */
	purchase(): void {
		if (this.purchased) {
			return;
		}

		this.purchased = true;
		this.effect();
	}

	/**
	 * Check if can be purchased
	 */
	canPurchase(): boolean {
		if (this.purchased) {
			return false;
		}

		if (this.requirement && !this.requirement()) {
			return false;
		}

		return true;
	}

	/**
	 * Check if requirement is met
	 */
	requirementMet(): boolean {
		if (!this.requirement) {
			return true;
		}
		return this.requirement();
	}

	/**
	 * Unlock this upgrade
	 */
	unlock(): void {
		this.unlocked = true;
	}
}
