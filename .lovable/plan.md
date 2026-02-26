

# Apple Watch-Friendly Layout

The app currently works well on phones and desktops, but Apple Watch screens (roughly 160-200px wide) need a drastically simplified UI. The approach: detect ultra-small viewports and render a compact, single-purpose dice roller that strips away the LCARS chrome, history, links, and footer.

## What changes

### 1. New component: `WatchDiceRoller.tsx`
A minimal dice roller designed for ~180px wide screens:
- **No LCARS frame** -- skip the top bar, sidebar, bottom bar, links, and footer entirely
- **Compact controls**: A single row showing dice count (tappable number), target number, and focus range -- all as small tappable elements
- **Large ENGAGE button** filling the width
- **Results**: Show just the success count (big number) and complication count if any
- **No roll history**, no info panel, no sound controls
- Minimal padding (4-8px), smaller fonts

### 2. Update `Index.tsx`
Use a media query or viewport width check to conditionally render `WatchDiceRoller` instead of the full `LCARSFrame > DiceRoller` layout when the screen is very small (under 220px wide).

### 3. CSS additions in `index.css`
Add a `@media (max-width: 220px)` block to handle any watch-specific overrides if needed.

## Technical details

- **Breakpoint**: `max-width: 220px` covers Apple Watch SE (162px), Series 7-9 (176-198px)
- **Detection**: A `useIsWatch()` hook using `window.matchMedia`, similar to existing `useIsMobile()`
- **No new dependencies** required
- The watch version reuses the same dice logic (inline, not extracted) to keep it self-contained
- Controls use a stepper-style UI: tap left/right arrows around a number, all sized for touch targets (~32px minimum)

## Layout sketch (watch view)

```text
+------------------+
| STA2E-D20        |
|                  |
| Dice:  < 2 >    |
| TN:    < 10 >   |
| Focus: < 1 >    |
|                  |
| [   ENGAGE   ]   |
|                  |
|      3           |
|   SUCCESSES      |
|   1 COMP         |
+------------------+
```

## Files to create/modify
- **Create**: `src/components/WatchDiceRoller.tsx`
- **Create**: `src/hooks/use-watch.ts`
- **Modify**: `src/pages/Index.tsx` -- conditionally render watch vs full layout
- **Modify**: `src/index.css` -- optional watch-specific styles

