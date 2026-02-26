import Decimal from 'break_eternity.js';

export const GAME_VERSION = '1.0.0';
export const SAVE_KEY = 'egg-empire-save';
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const MAX_OFFLINE_TIME = 86400000; // 24 hours in ms

// Hatching
export const HATCH_COST = new Decimal(1); // costs 1 egg to try hatching
export const HATCH_SUCCESS_RATE = 0.5; // 50% chance of getting a chicken
export const HATCH_COOLDOWN_MS = 400; // faster hatching
export const HATCH_SUCCESS_RATE_BONUS_PER_UPGRADE = 0.05;

// Auto-hatch (bought with money)
export const AUTO_HATCH_BASE_COST = new Decimal(400);
export const AUTO_HATCH_GROWTH_RATE = 1.3;
export const AUTO_HATCH_INTERVAL = 2; // seconds between auto-hatches

// Selling prices
export const SELL_PRICES = {
	EGG: new Decimal(1),    // 1 money per egg
	// Rebalanced: avoid hatch->sell arbitrage dominating all other gameplay loops
	CHICKEN: new Decimal(8)
};

// Sell bundles
export const EGG_BUNDLES = [6, 12, 24, 30, 100, 1000] as const;
export const CHICKEN_BUNDLES = [1, 10, 100] as const;

// Phase unlock thresholds
export const PHASE_THRESHOLDS = {
	ARTISANAL: new Decimal(0),
	INDUSTRIAL: new Decimal(50000),
	BIOTECH: new Decimal(10000000),
	COSMIC: new Decimal(10000000000)
};

// Producer definitions
export const PRODUCERS = {
	CHICKEN: {
		id: 'chicken',
		name: 'Chicken',
		emoji: '🐔',
		description: 'A humble chicken that lays eggs',
		baseCost: new Decimal(10),
		baseProduction: new Decimal(0.02),
		growthRate: 1.15,
		resourceProduced: 'eggs',
		resourceCost: 'money'
	},
	COOP: {
		id: 'coop',
		name: 'Coop',
		emoji: '🏠',
		description: 'Each chicken +50% eggs',
		baseCost: new Decimal(50),
		baseProduction: new Decimal(0.5),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	FARM: {
		id: 'farm',
		name: 'Farm',
		emoji: '🌾',
		description: 'Each chicken +2× eggs',
		baseCost: new Decimal(500),
		baseProduction: new Decimal(2),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	FEED_OPTIMIZER: {
		id: 'feed_optimizer',
		name: 'Feed Optimizer',
		emoji: '🧪',
		description: 'Each chicken +5× eggs',
		baseCost: new Decimal(2500),
		baseProduction: new Decimal(5),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	// Industrial phase
	INCUBATOR: {
		id: 'incubator',
		name: 'Incubator',
		emoji: '🏭',
		description: 'Mass-produce chickens efficiently',
		baseCost: new Decimal(50000),
		baseProduction: new Decimal(50),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	FACTORY: {
		id: 'factory',
		name: 'Factory',
		emoji: '⚙️',
		description: 'Automated egg production at scale',
		baseCost: new Decimal(500000),
		baseProduction: new Decimal(500),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	CONVEYOR_BELT: {
		id: 'conveyor_belt',
		name: 'Conveyor Belt',
		emoji: '🔄',
		description: 'Continuous flow production line',
		baseCost: new Decimal(5000000),
		baseProduction: new Decimal(5000),
		growthRate: 1.14,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	MEGA_FACILITY: {
		id: 'mega_facility',
		name: 'Mega Facility',
		emoji: '🏭',
		description: 'Industrial complex dominating the landscape',
		baseCost: new Decimal(50000000),
		baseProduction: new Decimal(50000),
		growthRate: 1.13,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	// Biotech phase
	DNA_SEQUENCER: {
		id: 'dna_sequencer',
		name: 'DNA Sequencer',
		emoji: '🧬',
		description: 'Unlock the secrets of perfect eggs',
		baseCost: new Decimal(500000000),
		baseProduction: new Decimal(500000),
		growthRate: 1.16,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	GENE_LAB: {
		id: 'gene_lab',
		name: 'Gene Lab',
		emoji: '🔬',
		description: 'Engineer superior egg-laying organisms',
		baseCost: new Decimal(5000000000),
		baseProduction: new Decimal(5000000),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	BIOPRINTER: {
		id: 'bioprinter',
		name: 'Bioprinter',
		emoji: '🖨️',
		description: 'Print chickens molecule by molecule',
		baseCost: new Decimal(50000000000),
		baseProduction: new Decimal(50000000),
		growthRate: 1.14,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	EVOLUTION_CHAMBER: {
		id: 'evolution_chamber',
		name: 'Evolution Chamber',
		emoji: '🧫',
		description: 'Accelerate millions of years in seconds',
		baseCost: new Decimal(500000000000),
		baseProduction: new Decimal(500000000),
		growthRate: 1.17,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	// Cosmic phase
	SPACE_STATION: {
		id: 'space_station',
		name: 'Space Station',
		emoji: '🛸',
		description: 'Zero-gravity egg production',
		baseCost: new Decimal(5000000000000),
		baseProduction: new Decimal(5000000000),
		growthRate: 1.18,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	MOON_COLONY: {
		id: 'moon_colony',
		name: 'Moon Colony',
		emoji: '🌙',
		description: 'Lunar farms stretch across craters',
		baseCost: new Decimal(50000000000000),
		baseProduction: new Decimal(50000000000),
		growthRate: 1.16,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	DYSON_SPHERE: {
		id: 'dyson_sphere',
		name: 'Dyson Sphere',
		emoji: '⭐',
		description: 'Harness a star to power egg production',
		baseCost: new Decimal(500000000000000),
		baseProduction: new Decimal(500000000000),
		growthRate: 1.15,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	},
	MULTIVERSE_NEXUS: {
		id: 'multiverse_nexus',
		name: 'Multiverse Nexus',
		emoji: '🌌',
		description: 'Extract eggs from parallel universes',
		baseCost: new Decimal(5000000000000000),
		baseProduction: new Decimal(5000000000000),
		growthRate: 1.12,
		resourceProduced: 'chicken_boost',
		resourceCost: 'money'
	}
};

// Upgrade definitions
export const UPGRADES = {
	BETTER_HANDS: {
		id: 'better_hands',
		name: 'Better Hands',
		description: 'Click 2x as effectively',
		cost: new Decimal(50),
		resourceCost: 'money',
		multiplier: 2
	},
	SELECTIVE_BREEDING: {
		id: 'selective_breeding',
		name: 'Selective Breeding',
		description: 'Chickens produce 2x eggs',
		cost: new Decimal(200),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'chicken'
	},
	ORGANIC_LABEL: {
		id: 'organic_label',
		name: 'Organic Label',
		description: 'Eggs sell for 2x money',
		cost: new Decimal(500),
		resourceCost: 'money',
		multiplier: 2
	},
	HEATED_COOPS: {
		id: 'heated_coops',
		name: 'Heated Coops',
		description: 'Coops produce 3x eggs',
		cost: new Decimal(2000),
		resourceCost: 'money',
		producerMultiplier: 3,
		targetProducer: 'coop'
	},
	PREMIUM_FEED: {
		id: 'premium_feed',
		name: 'Premium Feed',
		description: 'All production +50%',
		cost: new Decimal(10000),
		resourceCost: 'money',
		globalMultiplier: 1.5
	},
	// Industrial phase upgrades
	INDUSTRIAL_AUTOMATION: {
		id: 'industrial_automation',
		name: 'Industrial Automation',
		description: 'Incubators produce 2x eggs',
		cost: new Decimal(100000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'incubator'
	},
	QUALITY_CONTROL: {
		id: 'quality_control',
		name: 'Quality Control',
		description: 'Factories produce 2x eggs',
		cost: new Decimal(1000000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'factory'
	},
	EFFICIENT_CLICKS: {
		id: 'efficient_clicks',
		name: 'Efficient Clicks',
		description: 'Click 3x as effectively',
		cost: new Decimal(250000),
		resourceCost: 'money',
		multiplier: 3
	},
	MASS_PRODUCTION: {
		id: 'mass_production',
		name: 'Mass Production',
		description: 'All industrial producers +50%',
		cost: new Decimal(2500000),
		resourceCost: 'money',
		globalMultiplier: 1.5
	},
	ROBOTICS: {
		id: 'robotics',
		name: 'Robotics',
		description: 'Conveyor Belts produce 3x eggs',
		cost: new Decimal(10000000),
		resourceCost: 'money',
		producerMultiplier: 3,
		targetProducer: 'conveyor_belt'
	},
	// Biotech phase upgrades
	GENETIC_ENHANCEMENT: {
		id: 'genetic_enhancement',
		name: 'Genetic Enhancement',
		description: 'DNA Sequencers produce 2x eggs',
		cost: new Decimal(1000000000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'dna_sequencer'
	},
	CRISPR_TECH: {
		id: 'crispr_tech',
		name: 'CRISPR Technology',
		description: 'Gene Labs produce 2x eggs',
		cost: new Decimal(10000000000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'gene_lab'
	},
	SYNTHETIC_BIOLOGY: {
		id: 'synthetic_biology',
		name: 'Synthetic Biology',
		description: 'All biotech producers +50%',
		cost: new Decimal(25000000000),
		resourceCost: 'money',
		globalMultiplier: 1.5
	},
	QUANTUM_DNA: {
		id: 'quantum_dna',
		name: 'Quantum DNA',
		description: 'Bioprinters produce 3x eggs',
		cost: new Decimal(100000000000),
		resourceCost: 'money',
		producerMultiplier: 3,
		targetProducer: 'bioprinter'
	},
	SUPER_CLICKS: {
		id: 'super_clicks',
		name: 'Super Clicks',
		description: 'Click 5x as effectively',
		cost: new Decimal(50000000000),
		resourceCost: 'money',
		multiplier: 5
	},
	// Cosmic phase upgrades
	ZERO_G_OPTIMIZATION: {
		id: 'zero_g_optimization',
		name: 'Zero-G Optimization',
		description: 'Space Stations produce 2x eggs',
		cost: new Decimal(10000000000000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'space_station'
	},
	LUNAR_EFFICIENCY: {
		id: 'lunar_efficiency',
		name: 'Lunar Efficiency',
		description: 'Moon Colonies produce 2x eggs',
		cost: new Decimal(100000000000000),
		resourceCost: 'money',
		producerMultiplier: 2,
		targetProducer: 'moon_colony'
	},
	STELLAR_POWER: {
		id: 'stellar_power',
		name: 'Stellar Power',
		description: 'Dyson Spheres produce 3x eggs',
		cost: new Decimal(1000000000000000),
		resourceCost: 'money',
		producerMultiplier: 3,
		targetProducer: 'dyson_sphere'
	},
	INTERDIMENSIONAL_BOOST: {
		id: 'interdimensional_boost',
		name: 'Interdimensional Boost',
		description: 'All cosmic producers +50%',
		cost: new Decimal(5000000000000000),
		resourceCost: 'money',
		globalMultiplier: 1.5
	},
	COSMIC_CLICKS: {
		id: 'cosmic_clicks',
		name: 'Cosmic Clicks',
		description: 'Click 10x as effectively',
		cost: new Decimal(2500000000000000),
		resourceCost: 'money',
		multiplier: 10
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
		producers: ['incubator', 'factory', 'conveyor_belt', 'mega_facility'],
		upgrades: ['industrial_automation', 'quality_control', 'efficient_clicks', 'mass_production', 'robotics']
	},
	BIOTECH: {
		id: 'biotech',
		name: 'Biotech Era',
		description: 'Genetic modification and exponential growth',
		producers: ['dna_sequencer', 'gene_lab', 'bioprinter', 'evolution_chamber'],
		upgrades: ['genetic_enhancement', 'crispr_tech', 'synthetic_biology', 'quantum_dna', 'super_clicks']
	},
	COSMIC: {
		id: 'cosmic',
		name: 'Cosmic Age',
		description: 'Galactic colonization and universal domination',
		producers: ['space_station', 'moon_colony', 'dyson_sphere', 'multiverse_nexus'],
		upgrades: ['zero_g_optimization', 'lunar_efficiency', 'stellar_power', 'interdimensional_boost', 'cosmic_clicks']
	}
};
