import { SvelteMap } from 'svelte/reactivity';
import type { GameState } from '../engine/types';
import { ACHIEVEMENTS, type Achievement } from './achievements';

export class AchievementManager {
	unlocked = new SvelteMap<string, boolean>();
	rewardsApplied = new Set<string>();

	constructor() {
		ACHIEVEMENTS.forEach(a => {
			this.unlocked.set(a.id, false);
		});
	}

	check(gameState: GameState): Achievement[] {
		const newlyUnlocked: Achievement[] = [];

		ACHIEVEMENTS.forEach(achievement => {
			if (this.unlocked.get(achievement.id)) return;

			if (achievement.condition(gameState)) {
				this.unlocked.set(achievement.id, true);
				newlyUnlocked.push(achievement);

				if (!this.rewardsApplied.has(achievement.id)) {
					achievement.rewardEffect(gameState);
					this.rewardsApplied.add(achievement.id);
				}
			}
		});

		return newlyUnlocked;
	}

	getUnlocked(): Achievement[] {
		return ACHIEVEMENTS.filter(a => this.unlocked.get(a.id) === true);
	}

	getProgress() {
		const unlockedCount = this.getUnlocked().length;
		const total = ACHIEVEMENTS.length;
		return { unlocked: unlockedCount, total, percentage: total > 0 ? (unlockedCount / total) * 100 : 0 };
	}

	isUnlocked(id: string): boolean {
		return this.unlocked.get(id) === true;
	}

	getAllAchievements(): Achievement[] {
		return ACHIEVEMENTS;
	}

	serialize(): string[] {
		return Array.from(this.unlocked.entries()).filter(([_, v]) => v).map(([id]) => id);
	}

	deserialize(ids: string[], gameState: GameState) {
		ids.forEach(id => {
			this.unlocked.set(id, true);
			const a = ACHIEVEMENTS.find(x => x.id === id);
			if (a && !this.rewardsApplied.has(id)) {
				a.rewardEffect(gameState);
				this.rewardsApplied.add(id);
			}
		});
	}
}
