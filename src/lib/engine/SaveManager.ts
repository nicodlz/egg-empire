import Decimal from 'break_eternity.js';
import LZString from 'lz-string';
import type { GameState, SaveData, SerializedGameState } from './types';
import { GAME_VERSION, SAVE_KEY } from './constants';
import { achievementManager } from '../achievements/achievementManager';

export class SaveManager {
	/**
	 * Serialize game state to a save-friendly format
	 */
	static serialize(state: GameState): SerializedGameState {
		const resources: Record<string, { amount: string; totalEarned: string }> = {};
		state.resources.forEach((resource, id) => {
			resources[id] = {
				amount: resource.amount.toString(),
				totalEarned: resource.totalEarned.toString()
			};
		});

		const producers: Record<string, { owned: number; multiplier: string }> = {};
		state.producers.forEach((producer, id) => {
			producers[id] = {
				owned: producer.owned,
				multiplier: producer.multiplier.toString()
			};
		});

		const upgrades: Record<string, boolean> = {};
		state.upgrades.forEach((upgrade, id) => {
			upgrades[id] = upgrade.purchased;
		});

		const phases: Record<string, boolean> = {};
		state.phases.forEach((phase, id) => {
			phases[id] = phase.unlocked;
		});

		return {
			resources,
			producers,
			upgrades,
			phases,
			achievements: achievementManager.serialize(),
			currentPhase: state.currentPhase,
			totalClicks: state.totalClicks,
			clickPower: state.clickPower.toString(),
			totalPlayTime: state.totalPlayTime,
			autoHatchCount: state.autoHatchCount,
			statistics: {
				totalEggsProduced: state.statistics.totalEggsProduced.toString(),
				totalClicks: state.statistics.totalClicks,
				totalMoneyEarned: state.statistics.totalMoneyEarned.toString(),
				prestigeCount: state.statistics.prestigeCount,
				fastestPhaseUnlock: state.statistics.fastestPhaseUnlock
			}
		};
	}

	/**
	 * Deserialize save data back to game state
	 */
	static deserialize(data: SerializedGameState, state: GameState): void {
		// Restore resources
		Object.entries(data.resources).forEach(([id, resData]) => {
			const resource = state.resources.get(id);
			if (resource) {
				resource.amount = new Decimal(resData.amount);
				resource.totalEarned = new Decimal(resData.totalEarned);
			}
		});

		// Restore producers
		Object.entries(data.producers).forEach(([id, prodData]) => {
			const producer = state.producers.get(id);
			if (producer) {
				producer.owned = prodData.owned;
				producer.multiplier = new Decimal(prodData.multiplier);
			}
		});

		// Restore upgrades
		Object.entries(data.upgrades).forEach(([id, purchased]) => {
			const upgrade = state.upgrades.get(id);
			if (upgrade) {
				upgrade.purchased = purchased;
			}
		});

		// Restore phases (re-set in map to trigger SvelteMap reactivity)
		Object.entries(data.phases).forEach(([id, unlocked]) => {
			const phase = state.phases.get(id);
			if (phase) {
				phase.unlocked = unlocked;
				state.phases.set(id, { ...phase });
			}
		});

		// Re-unlock producers/upgrades for unlocked phases
		// (unlockPhase() skips already-unlocked phases, so we do it manually)
		state.phases.forEach((phase) => {
			if (phase.unlocked) {
				phase.producers.forEach(producerId => {
					const producer = state.producers.get(producerId);
					if (producer) producer.unlock();
				});
				phase.upgrades.forEach(upgradeId => {
					const upgrade = state.upgrades.get(upgradeId);
					if (upgrade) upgrade.unlock();
				});
			}
		});

		// Restore achievements
		if (data.achievements) {
			achievementManager.deserialize(data.achievements, state);
		}

		// Restore game state
		state.currentPhase = data.currentPhase;
		state.totalClicks = data.totalClicks;
		state.clickPower = new Decimal(data.clickPower);
		state.totalPlayTime = data.totalPlayTime;
		state.autoHatchCount = data.autoHatchCount ?? 0;

		// Restore statistics
		state.statistics.totalEggsProduced = new Decimal(data.statistics.totalEggsProduced);
		state.statistics.totalClicks = data.statistics.totalClicks;
		state.statistics.totalMoneyEarned = new Decimal(data.statistics.totalMoneyEarned);
		state.statistics.prestigeCount = data.statistics.prestigeCount;
		state.statistics.fastestPhaseUnlock = data.statistics.fastestPhaseUnlock;
	}

	/**
	 * Save game state to localStorage with compression
	 */
	static save(state: GameState): void {
		try {
			const saveData: SaveData = {
				version: GAME_VERSION,
				timestamp: Date.now(),
				state: this.serialize(state)
			};

			const json = JSON.stringify(saveData);
			const compressed = LZString.compressToUTF16(json);
			localStorage.setItem(SAVE_KEY, compressed);
		} catch (error) {
			console.error('Failed to save game:', error);
		}
	}

	/**
	 * Load game state from localStorage
	 */
	static load(state: GameState): boolean {
		try {
			const compressed = localStorage.getItem(SAVE_KEY);
			if (!compressed) {
				return false;
			}

			const json = LZString.decompressFromUTF16(compressed);
			if (!json) {
				return false;
			}

			const saveData: SaveData = JSON.parse(json);
			
			// Version check (for future migrations)
			if (saveData.version !== GAME_VERSION) {
				console.warn(`Save version mismatch: ${saveData.version} vs ${GAME_VERSION}`);
				// Could implement migration logic here
			}

			this.deserialize(saveData.state, state);
			state.lastSaveTime = saveData.timestamp;
			
			return true;
		} catch (error) {
			console.error('Failed to load game:', error);
			return false;
		}
	}

	/**
	 * Export save as base64 string
	 */
	static export(state: GameState): string {
		const saveData: SaveData = {
			version: GAME_VERSION,
			timestamp: Date.now(),
			state: this.serialize(state)
		};

		const json = JSON.stringify(saveData);
		return LZString.compressToBase64(json);
	}

	/**
	 * Import save from base64 string
	 */
	static import(saveString: string, state: GameState): boolean {
		try {
			const json = LZString.decompressFromBase64(saveString);
			if (!json) {
				return false;
			}

			const saveData: SaveData = JSON.parse(json);
			this.deserialize(saveData.state, state);
			
			return true;
		} catch (error) {
			console.error('Failed to import save:', error);
			return false;
		}
	}

	/**
	 * Delete save data
	 */
	static deleteSave(): void {
		localStorage.removeItem(SAVE_KEY);
	}

	/**
	 * Check if save exists
	 */
	static hasSave(): boolean {
		return localStorage.getItem(SAVE_KEY) !== null;
	}
}
