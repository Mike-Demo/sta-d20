

## 404 Page Polish -- Lower Decks Flavor Pass

Four small, scoped changes to `src/pages/NotFound.tsx` only. No global styles or other files touched.

### 1. Add two tiny LCARS flavor labels

Insert a row of two small LCARS status chips between the Heisenberg compensator indicator and the return button:

- "Temporal Integrity: Nominal (for now)"
- "Cerritos Ops: Mildly Concerned"

Styled as small `bg-muted` rounded bars with `text-lcars-arctic-snow` and `text-lcars-gold` respectively, matching the existing compact label style.

### 2. Add a micro-gag under the error code

In the diagnostic readout panel, add a tiny italic footnote line below the data rows:

*"GNDN: Goes Nowhere, Does Nothing -- like this page."*

Styled as `text-muted-foreground text-[10px] italic` to match the existing tiny-text convention used elsewhere on the page.

### 3. Make the return button chunkier

- Increase vertical padding from `py-4` to `py-5`
- Add a visible border: `border-2 border-lcars-arctic-ice`
- Add a subtle left/right segmented accent by wrapping the button in a flex row with two small decorative LCARS blocks (thin `bg-lcars-beta-blue` bars) flanking it, giving it the segmented panel look

### 4. Add an animated LCARS processing bar

Insert a small horizontal bar below the diagnostic readout panel -- a thin (`h-1.5`) rounded bar with a CSS shimmer/sweep animation. The bar background will be `bg-lcars-night-cloud` with a lighter `bg-lcars-arctic-ice` segment that slides left-to-right using a scoped `@keyframes` added to the existing `<style>` block. This sells the "system running diagnostics" illusion.

### Technical details

- File changed: `src/pages/NotFound.tsx` only
- Animations added to the existing scoped `<style>` block (no global CSS changes)
- All new elements use existing Tailwind color tokens and font classes
- Responsive and accessible (decorative elements marked `aria-hidden`)

