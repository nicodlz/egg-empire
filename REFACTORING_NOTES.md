# Refactoring: From Custom CSS to Library-First

## The Problem

Initial implementation used **hand-rolled CSS animations** and **custom components from scratch**:

```css
/* BAD: Custom keyframe animations */
@keyframes affordable-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 6px rgba(255, 215, 0, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 12px rgba(255, 215, 0, 0.5);
  }
}

@keyframes liquid-wave {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, 5px); }
}

/* Plus 20+ more custom animations... */
```

This approach:
- ❌ More code to maintain
- ❌ Reinventing the wheel
- ❌ Harder to debug
- ❌ Less performant than GSAP
- ❌ No timeline control

## The Solution

Use established libraries for their strengths:

### 1. GSAP for All Animations

```typescript
// GOOD: GSAP handles it better
gsap.to(cardElement, {
  boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
  duration: 0.8,
  yoyo: true,
  repeat: -1,
  ease: 'sine.inOut'
});
```

Benefits:
- ✅ Timelines & sequencing
- ✅ Better easing functions
- ✅ Performance optimized
- ✅ Easy to kill/control
- ✅ Works with any property

### 2. bits-ui for Components

```typescript
// GOOD: Reusable, accessible button with variants
<Button 
  variant={isAffordable ? 'default' : 'secondary'}
  size="lg"
  onclick={handleClick}
>
  Buy Now
</Button>
```

Instead of:
```html
<!-- BAD: Custom button every time -->
<button class="custom-btn affordable-pulse">...</button>
```

### 3. Tailwind for Styling

```html
<!-- GOOD: Utility classes -->
<div class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
```

Instead of:
```html
<!-- BAD: Custom classes needing CSS -->
<div class="resource-item">
<style>
  .resource-item {
    display: flex;
    align-items: center;
    /* ... */
  }
</style>
```

## Before & After

### Counter Animation

**Before (CSS):**
```css
.big-number {
  animation: roll-number 0.5s ease-out;
}
@keyframes roll-number {
  /* Complex CSS hack */
}
```

**After (GSAP):**
```typescript
gsap.to({ value: displayValue }, {
  value: actualValue,
  duration: 0.5,
  ease: 'power2.out',
  onUpdate: function() {
    displayValue = this.targets()[0].value;
  }
});
```

### Pulse Effect

**Before (CSS):**
```css
.affordable {
  animation: affordable-pulse 1.5s ease-in-out infinite;
}
```

**After (GSAP + $effect):**
```typescript
$effect(() => {
  if (isAffordable) {
    gsap.to(cardElement, {
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
      duration: 0.8,
      yoyo: true,
      repeat: -1
    });
  } else {
    gsap.killTweensOf(cardElement);
  }
});
```

### Modal Animations

**Before (CSS):**
```css
.modal {
  animation: fade-in 0.2s, slide-up 0.3s;
}
@keyframes fade-in { /* ... */ }
@keyframes slide-up { /* ... */ }
```

**After (GSAP Timeline):**
```typescript
gsap.fromTo(modalElement,
  { opacity: 0 },
  { opacity: 1, duration: 0.2 }
);
gsap.fromTo(contentElement,
  { y: 20, opacity: 0, scale: 0.95 },
  { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
);
```

## Component Evolution

### Button Component

**Before:**
```html
<button class="buy-button affordable">
  Buy for 100 eggs
</button>

<style>
  .buy-button {
    background: linear-gradient(...);
    border-radius: 8px;
    /* 30 lines of CSS */
  }
  .buy-button.affordable {
    animation: pulse 1.5s infinite;
  }
</style>
```

**After:**
```html
<Button 
  variant={isAffordable ? 'default' : 'secondary'}
  onclick={handleBuy}
>
  Buy for {formatNumber(cost)} 🥚
</Button>
```

### Card Component

**Before:**
```html
<div class="producer-card affordable">
  <!-- content -->
</div>

<style>
  .producer-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    /* 20 lines of CSS */
  }
</style>
```

**After:**
```html
<Card class="border-2 {isAffordable ? 'border-amber-400' : 'border-transparent'}">
  <!-- content -->
</Card>
```

## File Size Reduction

**Before:**
- `app.css`: 3,242 bytes (100+ lines of custom CSS)

**After:**
- `app.css`: 720 bytes (only essentials)

**Savings:** 78% reduction in custom CSS

## Performance

GSAP benefits:
- GPU-accelerated by default
- Automatic will-change optimization
- Better than CSS for complex sequences
- Easy to pause/resume/kill

## Maintainability

**Before:**
- Custom CSS scattered across files
- Hard to find which animation does what
- Difficult to modify timing/easing
- No way to sequence animations

**After:**
- All animations in component logic
- Easy to see what animates when
- One place to adjust timing
- Full timeline control

## The Rules

Going forward:

1. **Never write custom keyframe animations** → Use GSAP
2. **Never write custom button/card styles** → Use bits-ui/shadcn
3. **Never write layout CSS** → Use Tailwind utilities
4. **Only custom CSS for:** Font smoothing, body defaults, resets

## Lessons Learned

- Libraries exist for a reason - use them
- Don't reinvent the wheel
- GSAP is better at animations than CSS
- Component libraries save time
- Tailwind is faster than custom CSS
- Less code = less bugs

---

**Result:** Cleaner, more maintainable, better performing, easier to extend. 🎉
