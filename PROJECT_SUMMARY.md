# Egg Empire - Project Summary

## ✅ Complete & Ready to Play

A fully functional idle game built with modern best practices.

## Tech Stack (Refactored)

### UI Components
- **bits-ui** - Headless component primitives
- **tailwind-variants** - Type-safe variant API for Tailwind
- **Tailwind CSS 4** - All layout, spacing, and colors
- **Custom CSS** - Minimal (only essentials like font smoothing)

### Animations
- **GSAP** - All animations (counter rolls, pulses, transitions, glow effects)
- **canvas-confetti** - Particle effects

### Game Logic
- **Svelte 5** (runes: `$state`, `$derived`, `$effect`)
- **TypeScript strict**
- **break_eternity.js** - Big number support
- **lz-string** - Save compression

## Architecture

```
src/lib/
├── engine/          # Pure game logic (zero UI)
│   ├── GameEngine.ts      # RAF-based game loop
│   ├── types.ts           # All interfaces
│   ├── constants.ts       # Game balance
│   ├── formulas.ts        # Pure functions for costs/production
│   └── SaveManager.ts     # LocalStorage + compression
│
├── entities/        # Game objects
│   ├── Resource.ts
│   ├── Producer.ts
│   ├── Upgrade.ts
│   └── Registry.ts
│
├── state/           # Svelte 5 state management
│   ├── gameState.svelte.ts    # $state runes
│   ├── derived.svelte.ts      # Getter functions (not exported $derived)
│   └── actions.ts             # Pure functions that mutate state
│
└── components/      # UI (uses bits-ui + GSAP)
    ├── ui/
    │   ├── button.svelte      # Reusable button with variants
    │   └── card.svelte        # Reusable card wrapper
    ├── EggCounter.svelte      # Main clicker with GSAP bounce
    ├── ProducerCard.svelte    # Auto-pulsing when affordable
    ├── UpgradeButton.svelte   # GSAP glow effects
    ├── ProgressBar.svelte     # GSAP smooth fill
    ├── PhaseTransition.svelte # GSAP entrance/exit animations
    ├── ResourceBar.svelte     # Top stats bar
    └── StatsPanel.svelte      # Modal with GSAP slide-in
```

## Key Features

### ✨ Library-First Approach
- No hand-rolled CSS animations - all GSAP
- UI components use bits-ui primitives
- Tailwind utilities for all styling
- Only custom CSS: font smoothing, body styles, tabular nums

### 🎮 Gameplay
- Click eggs manually (with confetti!)
- Buy producers (chicken, coop, farm, etc.)
- Purchase upgrades (2x click, 3x production, etc.)
- Phase progression (Artisanal → Industrial → Biotech → Cosmic)
- Auto-save every 30 seconds
- Offline progress (up to 24h)

### 📱 Mobile-Optimized
- All touch targets ≥ 44px
- Responsive grid layouts
- Works perfectly on phones

### 🎨 Polish
- **GSAP counter animations** - Numbers roll smoothly
- **GSAP pulse effects** - Cards pulse when affordable
- **GSAP glow effects** - Upgrades glow dynamically
- **Phase transitions** - Full-screen celebration with confetti
- **Modal animations** - Smooth slide-in/fade-out

## Running the Game

```bash
# Install
npm install

# Dev
npm run dev
# Open http://localhost:5173

# Build
npm run build
npm run preview
```

## Game Balance (Phase 1)

**Producers:**
- Chicken: 10 eggs → 0.1/sec
- Coop: 100 eggs → 1/sec  
- Farm: 1,000 eggs → 8/sec
- Feed Optimizer: 5,000 eggs → 50/sec

**Upgrades:**
- Better Hands: 2x click (50 eggs)
- Selective Breeding: 2x chickens (200 eggs)
- Heated Coops: 3x coops (2,000 eggs)
- Premium Feed: 1.5x all (10,000 eggs)

**Phase 2 unlocks at 10,000 total eggs**

## What Changed (Refactor)

### Before
- ❌ Hand-written CSS keyframes
- ❌ Custom components from scratch
- ❌ Lots of custom styles

### After
- ✅ GSAP for all animations
- ✅ bits-ui for component primitives
- ✅ Tailwind for all styling
- ✅ Minimal custom CSS (only essentials)

## Next Steps

Easy to expand:
- Add Phase 2/3/4 content
- More producers and upgrades
- Achievement system
- Prestige mechanic
- Sound effects (howler.js already installed)
- Export/import saves

## Credits

Built following best practices:
- **UI**: bits-ui, Tailwind
- **Animations**: GSAP
- **State**: Svelte 5 runes
- **Game Logic**: SOLID principles, clean separation

Inspired by Universal Paperclips 🥚
