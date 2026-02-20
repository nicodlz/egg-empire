# 🥚 Egg Empire

An idle/incremental game about building a chicken egg empire, inspired by Universal Paperclips. Start with manual egg collection and grow to cosmic-scale egg production!

## Features

- **Addictive Idle Gameplay**: Click eggs manually or automate with producers
- **Progressive Phases**: 
  - 🐔 Artisanal Age - Humble beginnings
  - 🏭 Industrial Revolution - Mass production
  - 🧬 Biotech Era - Genetic modification
  - 🌌 Cosmic Age - Galactic domination
- **Satisfying Animations**: Built with GSAP for smooth, rewarding interactions
- **Big Number Support**: Handle astronomically large numbers with break_eternity.js
- **Auto-Save**: Never lose progress (saves every 30 seconds)
- **Offline Progress**: Earn eggs even when you're away (up to 24 hours)
- **Mobile-Friendly**: Touch-optimized UI that works great on phones

## Tech Stack

- **SvelteKit 2** with **Svelte 5** (using modern runes: `$state`, `$derived`, `$effect`)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** for styling
- **break_eternity.js** for big number math
- **GSAP** for animations
- **canvas-confetti** for particle effects
- **howler.js** for sound effects (ready to use)
- **lz-string** for save compression

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Architecture

The project follows SOLID principles with clean separation of concerns:

- **`src/lib/engine/`** - Pure game logic (no UI dependencies)
- **`src/lib/entities/`** - Game entities (Resource, Producer, Upgrade)
- **`src/lib/state/`** - Reactive state management with Svelte 5 runes
- **`src/lib/components/`** - UI components
- **`src/routes/`** - SvelteKit pages

## Game Balance

### Phase 1: Artisanal Age

**Resources:**
- Eggs (main currency)
- Money (from selling eggs)

**Producers:**
- Manual Click: 1 egg per click
- Chicken: 10 eggs → 0.1 eggs/sec
- Coop: 100 eggs → 1 egg/sec
- Free-range Farm: 1,000 eggs → 8 eggs/sec
- Feed Optimizer: 5,000 eggs → 50 eggs/sec

**Upgrades:**
- Better Hands: 2x click power (50 eggs)
- Selective Breeding: 2x chicken production (200 eggs)
- Organic Label: 2x money from eggs (500 eggs)
- Heated Coops: 3x coop production (2,000 eggs)
- Premium Feed: 1.5x all production (10,000 eggs)

**Phase 2 unlocks at 10,000 total eggs produced**

## Development Notes

- Uses Svelte 5 runes exclusively (no legacy stores or `$:` syntax)
- All game math uses Decimal from break_eternity.js
- Game loop runs via requestAnimationFrame with delta time
- Mobile-first design with 44px+ touch targets
- Auto-save every 30 seconds to localStorage
- Offline progress capped at 24 hours to prevent abuse

## Future Expansion

The architecture supports easy addition of:
- New phases (Biotech, Cosmic)
- New producers and upgrades
- Achievements system
- Prestige mechanics
- Sound effects
- More animations and polish

## License

MIT

## Credits

Inspired by Universal Paperclips by Frank Lantz.

Built with ❤️ using SvelteKit and Svelte 5.
