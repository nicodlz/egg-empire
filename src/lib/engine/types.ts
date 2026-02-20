import Decimal from 'break_eternity.js';

export interface Resource {
	id: string;
	name: string;
	amount: Decimal;
	totalEarned: Decimal;
	displayOrder: number;
}

export interface Producer {
	id: string;
	name: string;
	description: string;
	baseCost: Decimal;
	baseProduction: Decimal;
	growthRate: number;
	owned: number;
	resourceProduced: string;
	resourceCost: string;
	unlocked: boolean;
	multiplier: Decimal;
}

export interface Upgrade {
	id: string;
	name: string;
	description: string;
	cost: Decimal;
	resourceCost: string;
	purchased: boolean;
	unlocked: boolean;
	effect: () => void;
	requirement?: () => boolean;
}

export interface GamePhase {
	id: string;
	name: string;
	description: string;
	unlocked: boolean;
	unlockCondition: () => boolean;
	producers: string[];
	upgrades: string[];
}

export interface GameState {
	resources: Map<string, Resource>;
	producers: Map<string, Producer>;
	upgrades: Map<string, Upgrade>;
	phases: Map<string, GamePhase>;
	currentPhase: string;
	totalClicks: number;
	clickPower: Decimal;
	lastSaveTime: number;
	lastTickTime: number;
	totalPlayTime: number;
	autoHatchCount: number;
	autoHatchTimer: number;
	statistics: GameStatistics;
}

export interface GameStatistics {
	totalEggsProduced: Decimal;
	totalClicks: number;
	totalMoneyEarned: Decimal;
	prestigeCount: number;
	fastestPhaseUnlock: number;
}

export interface SaveData {
	version: string;
	timestamp: number;
	state: SerializedGameState;
}

export interface SerializedGameState {
	resources: Record<string, { amount: string; totalEarned: string }>;
	producers: Record<string, { owned: number; multiplier: string }>;
	upgrades: Record<string, boolean>;
	phases: Record<string, boolean>;
	currentPhase: string;
	totalClicks: number;
	clickPower: string;
	totalPlayTime: number;
	autoHatchCount: number;
	statistics: {
		totalEggsProduced: string;
		totalClicks: number;
		totalMoneyEarned: string;
		prestigeCount: number;
		fastestPhaseUnlock: number;
	};
}
