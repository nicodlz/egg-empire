import Decimal from 'break_eternity.js';
import type { GameState } from '../engine/types';

export interface Achievement {
	id: string;
	name: string;
	emoji: string;
	description: string;
	reward: string;
	condition: (state: GameState) => boolean;
	rewardEffect: (state: GameState) => void;
}

/**
 * List of all achievements in the game
 */
export const ACHIEVEMENTS: Achievement[] = [
	// === CLICK ACHIEVEMENTS ===
	{
		id: 'first_tap',
		name: 'First Tap',
		emoji: '👆',
		description: 'Click the egg 10 times',
		reward: '+1 Click Power',
		condition: (state) => state.totalClicks >= 10,
		rewardEffect: (state) => {
			state.clickPower = state.clickPower.plus(1);
		}
	},
	{
		id: 'tapper',
		name: 'Tapper',
		emoji: '👏',
		description: 'Click the egg 100 times',
		reward: '+5 Click Power',
		condition: (state) => state.totalClicks >= 100,
		rewardEffect: (state) => {
			state.clickPower = state.clickPower.plus(5);
		}
	},
	{
		id: 'click_machine',
		name: 'Click Machine',
		emoji: '🖱️',
		description: 'Click the egg 1,000 times',
		reward: '+25 Click Power',
		condition: (state) => state.totalClicks >= 1000,
		rewardEffect: (state) => {
			state.clickPower = state.clickPower.plus(25);
		}
	},
	{
		id: 'carpal_tunnel',
		name: 'Carpal Tunnel',
		emoji: '💪',
		description: 'Click the egg 10,000 times',
		reward: '+100 Click Power',
		condition: (state) => state.totalClicks >= 10000,
		rewardEffect: (state) => {
			state.clickPower = state.clickPower.plus(100);
		}
	},

	// === EGG ACHIEVEMENTS ===
	{
		id: 'dozen',
		name: 'Dozen',
		emoji: '🥚',
		description: 'Collect 12 eggs',
		reward: '+5% Production',
		condition: (state) => {
			const eggs = state.resources.get('eggs');
			return eggs ? eggs.totalEarned.gte(12) : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.05));
				}
			});
		}
	},
	{
		id: 'hundred',
		name: 'Hundred',
		emoji: '💯',
		description: 'Collect 100 eggs',
		reward: '+10% Production',
		condition: (state) => {
			const eggs = state.resources.get('eggs');
			return eggs ? eggs.totalEarned.gte(100) : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.1));
				}
			});
		}
	},
	{
		id: 'thousand',
		name: 'Thousand',
		emoji: '🎯',
		description: 'Collect 1,000 eggs',
		reward: '+15% Production',
		condition: (state) => {
			const eggs = state.resources.get('eggs');
			return eggs ? eggs.totalEarned.gte(1000) : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.15));
				}
			});
		}
	},
	{
		id: 'millionaire',
		name: 'Millionaire',
		emoji: '💰',
		description: 'Collect 1,000,000 eggs',
		reward: '+25% Production',
		condition: (state) => {
			const eggs = state.resources.get('eggs');
			return eggs ? eggs.totalEarned.gte(1000000) : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.25));
				}
			});
		}
	},
	{
		id: 'billionaire',
		name: 'Billionaire',
		emoji: '👑',
		description: 'Collect 1,000,000,000 eggs',
		reward: '+50% Production',
		condition: (state) => {
			const eggs = state.resources.get('eggs');
			return eggs ? eggs.totalEarned.gte(1000000000) : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.5));
				}
			});
		}
	},

	// === PRODUCER ACHIEVEMENTS ===
	{
		id: 'first_chicken',
		name: 'First Chicken',
		emoji: '🐔',
		description: 'Own 1 chicken',
		reward: '+2% Chicken Production',
		condition: (state) => {
			const chicken = state.producers.get('chicken');
			return chicken ? chicken.owned >= 1 : false;
		},
		rewardEffect: (state) => {
			const chicken = state.producers.get('chicken');
			if (chicken) {
				chicken.applyMultiplier(new Decimal(1.02));
			}
		}
	},
	{
		id: 'flock',
		name: 'Flock',
		emoji: '🐓',
		description: 'Own 10 chickens',
		reward: '+10% Chicken Production',
		condition: (state) => {
			const chicken = state.producers.get('chicken');
			return chicken ? chicken.owned >= 10 : false;
		},
		rewardEffect: (state) => {
			const chicken = state.producers.get('chicken');
			if (chicken) {
				chicken.applyMultiplier(new Decimal(1.1));
			}
		}
	},
	{
		id: 'empire',
		name: 'Empire',
		emoji: '🏰',
		description: 'Own 50 chickens',
		reward: '+25% Chicken Production',
		condition: (state) => {
			const chicken = state.producers.get('chicken');
			return chicken ? chicken.owned >= 50 : false;
		},
		rewardEffect: (state) => {
			const chicken = state.producers.get('chicken');
			if (chicken) {
				chicken.applyMultiplier(new Decimal(1.25));
			}
		}
	},
	{
		id: 'first_coop',
		name: 'First Coop',
		emoji: '🏠',
		description: 'Own 1 coop',
		reward: '+5% All Production',
		condition: (state) => {
			const coop = state.producers.get('coop');
			return coop ? coop.owned >= 1 : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.05));
				}
			});
		}
	},
	{
		id: 'industrialist',
		name: 'Industrialist',
		emoji: '🏭',
		description: 'Own 1 incubator',
		reward: '+10% All Production',
		condition: (state) => {
			const incubator = state.producers.get('incubator');
			return incubator ? incubator.owned >= 1 : false;
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.1));
				}
			});
		}
	},

	// === SPEED ACHIEVEMENTS ===
	{
		id: 'egg_per_sec_club',
		name: 'Egg/sec Club',
		emoji: '⏱️',
		description: 'Produce 1 egg per second',
		reward: '+3% Production',
		condition: (state) => {
			let totalProduction = new Decimal(0);
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					totalProduction = totalProduction.plus(producer.getProduction());
				}
			});
			return totalProduction.gte(1);
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.03));
				}
			});
		}
	},
	{
		id: 'speed_demon',
		name: 'Speed Demon',
		emoji: '🔥',
		description: 'Produce 100 eggs per second',
		reward: '+10% Production',
		condition: (state) => {
			let totalProduction = new Decimal(0);
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					totalProduction = totalProduction.plus(producer.getProduction());
				}
			});
			return totalProduction.gte(100);
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.1));
				}
			});
		}
	},
	{
		id: 'egg_storm',
		name: 'Egg Storm',
		emoji: '⚡',
		description: 'Produce 10,000 eggs per second',
		reward: '+20% Production',
		condition: (state) => {
			let totalProduction = new Decimal(0);
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					totalProduction = totalProduction.plus(producer.getProduction());
				}
			});
			return totalProduction.gte(10000);
		},
		rewardEffect: (state) => {
			state.producers.forEach(producer => {
				if (producer.unlocked) {
					producer.applyMultiplier(new Decimal(1.2));
				}
			});
		}
	}
];
