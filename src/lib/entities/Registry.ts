import type { Resource } from './Resource';
import type { Producer } from './Producer';
import type { Upgrade } from './Upgrade';
import type { GamePhase } from '../engine/types';

/**
 * Central registry for all game entities
 * Implements the Registry pattern for easy lookup and iteration
 */
export class Registry {
	private resources = new Map<string, Resource>();
	private producers = new Map<string, Producer>();
	private upgrades = new Map<string, Upgrade>();
	private phases = new Map<string, GamePhase>();

	// Resources
	registerResource(resource: Resource): void {
		this.resources.set(resource.id, resource);
	}

	getResource(id: string): Resource | undefined {
		return this.resources.get(id);
	}

	getAllResources(): Map<string, Resource> {
		return this.resources;
	}

	// Producers
	registerProducer(producer: Producer): void {
		this.producers.set(producer.id, producer);
	}

	getProducer(id: string): Producer | undefined {
		return this.producers.get(id);
	}

	getAllProducers(): Map<string, Producer> {
		return this.producers;
	}

	getUnlockedProducers(): Producer[] {
		return Array.from(this.producers.values()).filter(p => p.unlocked);
	}

	// Upgrades
	registerUpgrade(upgrade: Upgrade): void {
		this.upgrades.set(upgrade.id, upgrade);
	}

	getUpgrade(id: string): Upgrade | undefined {
		return this.upgrades.get(id);
	}

	getAllUpgrades(): Map<string, Upgrade> {
		return this.upgrades;
	}

	getAvailableUpgrades(): Upgrade[] {
		return Array.from(this.upgrades.values()).filter(
			u => u.unlocked && !u.purchased
		);
	}

	// Phases
	registerPhase(phase: GamePhase): void {
		this.phases.set(phase.id, phase);
	}

	getPhase(id: string): GamePhase | undefined {
		return this.phases.get(id);
	}

	getAllPhases(): Map<string, GamePhase> {
		return this.phases;
	}

	getUnlockedPhases(): GamePhase[] {
		return Array.from(this.phases.values()).filter(p => p.unlocked);
	}
}
