import { AchievementManager } from './AchievementManager.svelte';
import type { Achievement } from './achievements';

/**
 * Singleton achievement manager instance
 * Shared across the application
 */
export const achievementManager = new AchievementManager();

/**
 * Callback for when new achievements are unlocked
 */
let onAchievementUnlockedCallback: ((achievements: Achievement[]) => void) | null = null;

/**
 * Set the callback for achievement unlocks
 */
export function setAchievementCallback(callback: (achievements: Achievement[]) => void) {
	onAchievementUnlockedCallback = callback;
}

/**
 * Trigger achievement callback
 */
export function triggerAchievementCallback(achievements: Achievement[]) {
	if (onAchievementUnlockedCallback && achievements.length > 0) {
		onAchievementUnlockedCallback(achievements);
	}
}
