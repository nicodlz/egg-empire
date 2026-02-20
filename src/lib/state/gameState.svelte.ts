import Decimal from 'break_eternity.js';
import { Resource } from '../entities/Resource';
import { Producer } from '../entities/Producer';
import { Upgrade } from '../entities/Upgrade';
import { RESOURCES, PRODUCERS, UPGRADES, PHASES } from '../engine/constants';
import type { GameState, GamePhase, GameStatistics } from '../engine/types';

/**
 * Initialize game state with Svelte 5 runes
 * This is the single source of truth for all reactive game data
 */
function createGameState() {
	// Initialize resources
	const resources = new Map<string, Resource>();
	Object.values(RESOURCES).forEach(def => {
		resources.set(def.id, new Resource(def.id, def.name, def.displayOrder));
	});

	// Initialize producers
	const producers = new Map<string, Producer>();
	Object.values(PRODUCERS).forEach(def => {
		const producer = new Producer(
			def.id,
			def.name,
			def.description,
			def.baseCost,
			def.baseProduction,
			def.growthRate,
			def.resourceProduced,
			def.resourceCost
		);
		producers.set(def.id, producer);
	});

	// Initialize upgrades (effects will be bound in actions.ts)
	const upgrades = new Map<string, Upgrade>();
	// We'll initialize these properly when we create the actions

	// Initialize phases
	const phases = new Map<string, GamePhase>();
	Object.values(PHASES).forEach(def => {
		phases.set(def.id, {
			id: def.id,
			name: def.name,
			description: def.description,
			unlocked: def.id === 'artisanal', // First phase unlocked by default
			unlockCondition: () => true, // Will be set properly later
			producers: def.producers,
			upgrades: def.upgrades
		});
	});

	// Initialize statistics
	const statistics: GameStatistics = {
		totalEggsProduced: new Decimal(0),
		totalClicks: 0,
		totalMoneyEarned: new Decimal(0),
		prestigeCount: 0,
		fastestPhaseUnlock: 0
	};

	// Unlock initial producers
	producers.get('chicken')?.unlock();
	producers.get('coop')?.unlock();
	producers.get('farm')?.unlock();
	producers.get('feed_optimizer')?.unlock();

	const state = $state<GameState>({
		resources,
		producers,
		upgrades,
		phases,
		currentPhase: 'artisanal',
		totalClicks: 0,
		clickPower: new Decimal(1),
		lastSaveTime: Date.now(),
		lastTickTime: performance.now(),
		totalPlayTime: 0,
		statistics
	});

	return state;
}

// Export the reactive game state
export const gameState = createGameState();
