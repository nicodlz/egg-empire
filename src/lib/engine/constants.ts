import Decimal from 'break_eternity.js';

export const GAME_VERSION = '1.0.0';
export const SAVE_KEY = 'egg-empire-save';
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const MAX_OFFLINE_TIME = 86400000; // 24 hours in ms

// Phase unlock thresholds
export const PHASE_THRESHOLDS = {
	ARTISANAL: new Decimal(0),
	INDUSTRIAL: new Decimal(10000),
	BIOTECH: new Decimal(1000000),
	COSMIC: new Decimal(1000000000)
};

// Producer definitions
export const PRODUCERS = {
	CHICKEN: {
		id: 'chicken',
		name: 'Chicken',
		emoji: '🐔',
		description: 'A humble chicken that lays eggs',
		baseCost: new Decimal(10),
		baseProduction: new Decimal(0.1),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	},
	COOP: {
		id: 'coop',
		name: 'Coop',
		emoji: '🏠',
		description: 'A small coop to house your chickens',
		baseCost: new Decimal(100),
		baseProduction: new Decimal(1),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	},
	FARM: {
		id: 'farm',
		name: 'Farm',
		emoji: '🌾',
		description: 'Happy chickens produce more eggs',
		baseCost: new Decimal(1000),
		baseProduction: new Decimal(8),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	},
	FEED_OPTIMIZER: {
		id: 'feed_optimizer',
		name: 'Feed Optimizer',
		emoji: '🧪',
		description: 'Optimized nutrition for maximum production',
		baseCost: new Decimal(5000),
		baseProduction: new Decimal(50),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	},
	// Industrial phase
	INCUBATOR: {
		id: 'incubator',
		name: 'Incubator',
		emoji: '🏭',
		description: 'Mass-produce chickens efficiently',
		baseCost: new Decimal(50000),
		baseProduction: new Decimal(500),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	},
	FACTORY: {
		id: 'factory',
		name: 'Factory',
		emoji: '⚙️',
		description: 'Automated egg production at scale',
		baseCost: new Decimal(500000),
		baseProduction: new Decimal(5000),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'eggs'
	}
};

// Upgrade definitions
export const UPGRADES = {
	BETTER_HANDS: {
		id: 'better_hands',
		name: 'Better Hands',
		description: 'Click 2x as effectively',
		cost: new Decimal(50),
		resourceCost: 'eggs',
		multiplier: 2
	},
	SELECTIVE_BREEDING: {
		id: 'selective_breeding',
		name: 'Selective Breeding',
		description: 'Chickens produce 2x eggs',
		cost: new Decimal(200),
		resourceCost: 'eggs',
		producerMultiplier: 2,
		targetProducer: 'chicken'
	},
	ORGANIC_LABEL: {
		id: 'organic_label',
		name: 'Organic Label',
		description: 'Eggs sell for 2x money',
		cost: new Decimal(500),
		resourceCost: 'eggs',
		multiplier: 2
	},
	HEATED_COOPS: {
		id: 'heated_coops',
		name: 'Heated Coops',
		description: 'Coops produce 3x eggs',
		cost: new Decimal(2000),
		resourceCost: 'eggs',
		producerMultiplier: 3,
		targetProducer: 'coop'
	},
	PREMIUM_FEED: {
		id: 'premium_feed',
		name: 'Premium Feed',
		description: 'All production +50%',
		cost: new Decimal(10000),
		resourceCost: 'eggs',
		globalMultiplier: 1.5
	}
};

// Resource definitions
export const RESOURCES = {
	EGGS: {
		id: 'eggs',
		name: 'Eggs',
		displayOrder: 1
	},
	MONEY: {
		id: 'money',
		name: 'Money',
		displayOrder: 2
	},
	RESEARCH: {
		id: 'research',
		name: 'Research',
		displayOrder: 3
	},
	COSMIC_EGGS: {
		id: 'cosmic_eggs',
		name: 'Cosmic Eggs',
		displayOrder: 4
	}
};

// Phase definitions
export const PHASES = {
	ARTISANAL: {
		id: 'artisanal',
		name: 'Artisanal Age',
		description: 'Humble beginnings with manual egg collection',
		producers: ['chicken', 'coop', 'farm', 'feed_optimizer'],
		upgrades: ['better_hands', 'selective_breeding', 'organic_label', 'heated_coops', 'premium_feed']
	},
	INDUSTRIAL: {
		id: 'industrial',
		name: 'Industrial Revolution',
		description: 'Mass production and automation',
		producers: ['incubator', 'factory'],
		upgrades: []
	},
	BIOTECH: {
		id: 'biotech',
		name: 'Biotech Era',
		description: 'Genetic modification and exponential growth',
		producers: [],
		upgrades: []
	},
	COSMIC: {
		id: 'cosmic',
		name: 'Cosmic Age',
		description: 'Galactic colonization and universal domination',
		producers: [],
		upgrades: []
	}
};
