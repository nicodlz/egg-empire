import type { GameState } from '../engine/types';
import { ACHIEVEMENTS, type Achievement } from './achievements';

export class AchievementManager {
	// Non-reactive maps to avoid triggering Svelte reactivity loops
	private _unlocked = new Map<string, boolean>();
	private _rewardsApplied = new Set<string>();

	// Reactive counter for UI updates — increment when achievements change
	unlockedCount = $state(0);

	constructor() {
		ACHIEVEMENTS.forEach(a => {
			this._unlocked.set(a.id, false);
		});
	}

	check(gameState: GameState): Achievement[] {
		const newlyUnlocked: Achievement[] = [];

		ACHIEVEMENTS.forEach(achievement => {
			if (this._unlocked.get(achievement.id)) return;

			if (achievement.condition(gameState)) {
				this._unlocked.set(achievement.id, true);
				newlyUnlocked.push(achievement);

				if (!this._rewardsApplied.has(achievement.id)) {
					achievement.rewardEffect(gameState);
					this._rewardsApplied.add(achievement.id);
				}
			}
		});

		if (newlyUnlocked.length > 0) {
			this.unlockedCount = this.getUnlocked().length;
		}

		return newlyUnlocked;
	}

	getUnlocked(): Achievement[] {
		return ACHIEVEMENTS.filter(a => this._unlocked.get(a.id) === true);
	}

	getProgress() {
		const unlockedCount = this.getUnlocked().length;
		const total = ACHIEVEMENTS.length;
		return { unlocked: unlockedCount, total, percentage: total > 0 ? (unlockedCount / total) * 100 : 0 };
	}

	isUnlocked(id: string): boolean {
		return this._unlocked.get(id) === true;
	}

	getAllAchievements(): Achievement[] {
		return ACHIEVEMENTS;
	}

	serialize(): string[] {
		return Array.from(this._unlocked.entries()).filter(([_, v]) => v).map(([id]) => id);
	}

	deserialize(ids: string[], gameState: GameState) {
		ids.forEach(id => {
			this._unlocked.set(id, true);
			const a = ACHIEVEMENTS.find(x => x.id === id);
			if (a && !this._rewardsApplied.has(id)) {
				a.rewardEffect(gameState);
				this._rewardsApplied.add(id);
			}
		});
		this.unlockedCount = this.getUnlocked().length;
	}
}
