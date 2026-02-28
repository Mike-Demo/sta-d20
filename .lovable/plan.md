

# Update to Lower Decks LCARS Style Guide

## Overview
Remap the app's color palette to match the **Lower Decks PADD Theme** (v24.2 by Jim Robertus / thelcars.com) from the uploaded CSS style guide. The sounds will remain as synthesized Web Audio API tones since the MP3 files in the zip are binary and can't be extracted -- but the tone frequencies will be adjusted to better match the Lower Decks computer panel aesthetic.

## Color Mapping

The Lower Decks PADD theme defines these core colors:

| CSS Variable | Hex | Current app token it replaces |
|---|---|---|
| `--alpha-blue` | `#58e` | `--lcars-blue` (primary blue) |
| `--arctic-ice` | `#6cf` | `--lcars-mauve` (accent cyan) |
| `--arctic-snow` | `#9cf` | `--lcars-lavender` |
| `--radioactive` | `#8ff` | `--lcars-teal` (success/accent) |
| `--beta-blue` | `#79d` | `--lcars-peach` (secondary blue) |
| `--night-cloud` | `#344470` | `--muted` / background tones |
| `--night-rain` | `#455580` | `--card` / panel backgrounds |
| `--sunset-red` | `#f30` | `--lcars-red` / destructive |

The current warm gold/amber/peach palette shifts to a cool blue-dominant scheme.

## Changes

### 1. Update CSS variables (`src/index.css`)
- Remap all `--lcars-*` tokens to Lower Decks PADD hex values (converted to HSL for consistency)
- Update `--background`, `--card`, `--muted`, `--border` to use night-cloud/night-rain blues
- Update `--primary` from gold to alpha-blue
- Update `--accent` to radioactive (#8ff)
- Update `--destructive` to sunset-red (#f30)
- Keep foreground as light/white for contrast on dark blues

### 2. Update `tailwind.config.ts`
- Rename lcars color tokens: replace `gold`, `amber`, `peach` with `alpha-blue`, `arctic-ice`, `beta-blue`, `arctic-snow`, `radioactive`, `night-cloud`, `night-rain`, `sunset-red`

### 3. Update component color references
Files that reference `lcars-gold`, `lcars-amber`, `lcars-peach`, `lcars-mauve`, `lcars-lavender`, `lcars-teal`, `lcars-red` need updating:

- **`LCARSFrame.tsx`** -- sidebar bars, top/bottom bars, title bar, link buttons
- **`DiceRoller.tsx`** -- dice pool buttons, target/focus controls, roll button, dice result colors, info panel, ship's log header
- **`RollHistory.tsx`** -- stardate color, critical/success/complication colors
- **`WatchDiceRoller.tsx`** -- minor color references
- **`SplashScreen.tsx`** -- drop shadow color

### 4. Adjust sound frequencies (`src/lib/sounds.ts`)
The Lower Decks computer panels have a cooler, more subdued tone. Shift the synthesized sounds to slightly lower, more "liquid" frequencies to match the Lower Decks aesthetic -- smoother chirps rather than sharp TNG-style pings.

### 5. Attribution
Add a credit line for the LCARS CSS framework by Jim Robertus (thelcars.com) in the footer alongside the existing Icons8 credit.

## Technical Notes
- The uploaded zip's MP3 sound files (beep1-beep4) are embedded as compressed binary data and cannot be extracted. The existing Web Audio API approach will be retained with adjusted frequencies.
- All colors will be stored as HSL in CSS custom properties to maintain consistency with the existing shadcn/ui pattern.
- The new color scheme is predominantly blue-toned, so contrast ratios will be verified to ensure readability.

