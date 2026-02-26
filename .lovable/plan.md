

# PWA Splash Screen

Since this is a Progressive Web App, the "splash screen" works differently than a native app. There are two approaches, and I recommend both:

## 1. Native PWA Splash (automatic, via manifest)

When users install the PWA and launch it, the browser automatically generates a splash screen from the manifest's `name`, `background_color`, `theme_color`, and icon. This is already partially configured. We just need to ensure the icon is high quality and the manifest values are correct -- which they are (`#141a2e` background, `STA2E-D20` name, 512px icon). No changes needed here.

## 2. In-App Splash Screen (animated, on first load)

This adds a brief LCARS-themed splash overlay that appears while the app loads, then fades out. This gives the app a polished, branded feel on every launch (not just PWA installs).

### What it looks like
- Full-screen dark background matching the app theme (`#141a2e`)
- The app icon (star) centered and pulsing
- "STA2E-D20" title in Orbitron font with an LCARS gold glow
- A small LCARS-style scanning bar animation below
- Auto-dismisses after ~2 seconds with a fade-out transition

### Files to modify

**`src/components/SplashScreen.tsx`** (new)
- A simple component rendering the splash overlay
- Uses `useState` + `useEffect` with a 2-second timer to trigger fade-out
- After fade-out animation completes (~300ms), removes itself from the DOM
- Uses the existing LCARS color tokens and Orbitron font

**`src/App.tsx`** (modify)
- Import and render `SplashScreen` at the top level
- The splash renders on top of everything via fixed positioning and high z-index
- Once dismissed, it unmounts and the app is fully interactive underneath

**`src/index.css`** (modify)
- Add a `@keyframes splash-fade-out` animation
- Add a subtle pulse animation for the icon

### Technical notes
- No new dependencies required
- The splash uses existing CSS variables and font classes
- It renders in parallel with the lazy-loaded routes (via `Suspense`), so the app loads behind it
- The 2-second duration is short enough to not annoy repeat users but long enough to mask any loading jank
- Uses `pointer-events: none` during fade-out so users can interact immediately

