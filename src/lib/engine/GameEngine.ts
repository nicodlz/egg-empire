import Decimal from 'break_eternity.js';
import type { GameState } from './types';
import { SaveManager } from './SaveManager';
import { AUTO_SAVE_INTERVAL, MAX_OFFLINE_TIME } from './constants';
import { calculateOfflineProgress } from './formulas';

export class GameEngine {
	private animationFrameId: number | null = null;
	private lastAutoSave = 0;
	private autoSaveInterval = AUTO_SAVE_INTERVAL;

	constructor(
		private state: GameState,
		private onTick: (deltaTime: number) => void
	) {}

	/**
	 * Start the game loop
	 */
	start(): void {
		if (this.animationFrameId !== null) {
			return; // Already running
		}

		this.state.lastTickTime = performance.now();
		this.tick();
	}

	/**
	 * Stop the game loop
	 */
	stop(): void {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * Main game loop tick
	 */
	private tick = (): void => {
		const now = performance.now();
		const deltaTime = (now - this.state.lastTickTime) / 1000; // Convert to seconds
		
		// Cap delta time to prevent huge jumps
		const cappedDelta = Math.min(deltaTime, 1.0);
		
		this.state.lastTickTime = now;
		this.state.totalPlayTime += cappedDelta;

		// Call the game update callback
		this.onTick(cappedDelta);

		// Auto-save check
		if (now - this.lastAutoSave > this.autoSaveInterval) {
			this.autoSave();
			this.lastAutoSave = now;
		}

		// Continue the loop
		this.animationFrameId = requestAnimationFrame(this.tick);
	};

	/**
	 * Auto-save the game
	 */
	private autoSave(): void {
		SaveManager.save(this.state);
	}

	/**
	 * Calculate offline progress when returning to game
	 */
	calculateOfflineProgress(productionPerSecond: Decimal): Decimal {
		const now = Date.now();
		const offlineTime = now - this.state.lastSaveTime;

		if (offlineTime < 1000) {
			return new Decimal(0); // Less than 1 second offline
		}

		return calculateOfflineProgress(productionPerSecond, offlineTime, MAX_OFFLINE_TIME);
	}

	/**
	 * Get offline time in milliseconds
	 */
	getOfflineTime(): number {
		const now = Date.now();
		return Math.max(0, now - this.state.lastSaveTime);
	}

	/**
	 * Force save
	 */
	save(): void {
		SaveManager.save(this.state);
		this.state.lastSaveTime = Date.now();
	}

	/**
	 * Load saved game
	 */
	load(): boolean {
		return SaveManager.load(this.state);
	}

	/**
	 * Reset game state (hard reset)
	 */
	reset(): void {
		SaveManager.deleteSave();
	}
}
