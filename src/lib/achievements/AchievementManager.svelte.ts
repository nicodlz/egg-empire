import type { GameState } from '../engine/types';
import { ACHIEVEMENTS, type Achievement } from './achievements';

/**
 * Achievement Manager with Svelte 5 reactivity
 * Tracks unlocked achievements and checks conditions
 */
export class AchievementManager {
	// Track which achievements are unlocked
	unlocked = $state<Map<string, boolean>>(new Map());
	
	// Track which rewards have been applied
	rewardsApplied = $state<Map<string, boolean>>(new Map());

	constructor() {
		// Initialize all achievements as locked
		ACHIEVEMENTS.forEach(achievement => {
			this.unlocked.set(achievement.id, false);
			this.rewardsApplied.set(achievement.id, false);
		});
	}

	/**
	 * Check all achievement conditions and unlock new ones
	 * Returns array of newly unlocked achievements
	 */
	check(gameState: GameState): Achievement[] {
		const newlyUnlocked: Achievement[] = [];

		ACHIEVEMENTS.forEach(achievement => {
			// Skip if already unlocked
			if (this.unlocked.get(achievement.id)) {
				return;
			}

			// Check if condition is met
			if (achievement.condition(gameState)) {
				this.unlocked.set(achievement.id, true);
				newlyUnlocked.push(achievement);

				// Apply reward immediately
				if (!this.rewardsApplied.get(achievement.id)) {
					achievement.rewardEffect(gameState);
					this.rewardsApplied.set(achievement.id, true);
				}
			}
		});

		return newlyUnlocked;
	}

	/**
	 * Get all unlocked achievements
	 */
	getUnlocked(): Achievement[] {
		return ACHIEVEMENTS.filter(achievement => 
			this.unlocked.get(achievement.id) === true
		);
	}

	/**
	 * Get achievement progress (percentage unlocked)
	 */
	getProgress(): { unlocked: number; total: number; percentage: number } {
		const unlockedCount = this.getUnlocked().length;
		const total = ACHIEVEMENTS.length;
		const percentage = total > 0 ? (unlockedCount / total) * 100 : 0;

		return {
			unlocked: unlockedCount,
			total,
			percentage
		};
	}

	/**
	 * Check if a specific achievement is unlocked
	 */
	isUnlocked(achievementId: string): boolean {
		return this.unlocked.get(achievementId) === true;
	}

	/**
	 * Get all achievements (for display)
	 */
	getAllAchievements(): Achievement[] {
		return ACHIEVEMENTS;
	}

	/**
	 * Serialize for saving
	 */
	serialize(): string[] {
		return Array.from(this.unlocked.entries())
			.filter(([_, unlocked]) => unlocked)
			.map(([id]) => id);
	}

	/**
	 * Deserialize from save data
	 */
	deserialize(unlockedIds: string[], gameState: GameState) {
		unlockedIds.forEach(id => {
			this.unlocked.set(id, true);
			
			// Re-apply rewards
			const achievement = ACHIEVEMENTS.find(a => a.id === id);
			if (achievement && !this.rewardsApplied.get(id)) {
				achievement.rewardEffect(gameState);
				this.rewardsApplied.set(id, true);
			}
		});
	}
}
