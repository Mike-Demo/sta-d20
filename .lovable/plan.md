# LCARS Theme Switcher

## Overview

Add a theme selector button to the LCARS frame that lets users switch between 6 LCARS themes from thelcars.com v24.2. The selected theme persists via localStorage. Lower Decks PADD remains the default.

## Themes


| Theme                 | Era              | Palette Character                       |
| --------------------- | ---------------- | --------------------------------------- |
| Lower Decks PADD      | 2380s (animated) | Cool blues, cyan accents                |
| Lower Decks Standard  | 2380s (animated) | Warm oranges, amber, pumpkin            |
| Classic Standard      | TNG/DS9/VOY      | Purple, orange, peach                   |
| Classic Ultra         | TNG/DS9/VOY      | Same colors as Classic, bolder contrast |
| Nemesis Blue Standard | TNG films        | Steel blues, wheat accents              |
| Nemesis Blue Ultra    | TNG films        | Same as Nemesis Blue, bolder contrast   |


## What Changes

### 1. New file: `src/lib/themes.ts`

A theme definitions module containing:

- A `ThemeId` union type for the 6 theme keys
- A `themes` record mapping each ID to its display name and full set of CSS custom property overrides (all `--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--accent`, `--destructive`, `--border`, `--lcars-*` tokens)
- `getTheme()` / `setTheme()` helpers that read/write `localStorage` key `lcars-theme`
- `applyTheme(id)` function that sets all CSS variables on `document.documentElement.style`

Color mappings derived from thelcars.com/colors.php (v24.2):

- **Lower Decks PADD**: Current values (no change)
- **Lower Decks Standard**: Background stays dark black. Primary bars use `#ff7700` (orange), `#ffaa44` (harvestgold), `#ff9911` (daybreak). Accent: `#ffeecc` (butter). Destructive: `#ff4400` (october-sunset). Sidebar bars: `#cc5500` (rich-pumpkin), `#ffcc99` (honey).
- **Classic Standard**: Primary: `#cc99ff` (african-violet). Bars: `#ff9966` (butterscotch), `#ff8800` (orange), `#ffaa00` (gold). Accent: `#99ccff` (ice). Muted: `#666688` (gray). Destructive: `#ff2200` (mars).
- **Classic Ultra**: Same palette as Classic Standard with slightly brighter/bolder primary and accent values for higher contrast on wider layouts.
- **Nemesis Blue Standard**: Primary: `#6699ff` (cool). Bars: `#2266ff` (evening), `#88bbff` (ghost). Accent: `#ebf0ff` (moonbeam). Muted: `#52526a` (galaxy-gray). Destructive: `#cc2233` (cardinal).
- **Nemesis Blue Ultra**: Same palette as Nemesis Blue Standard with bolder primary and richer blues.

### 2. New file: `src/components/ThemeSwitcher.tsx`

A small dropdown/popover button component:

- Renders an LCARS-styled pill button labeled with the current theme name (or a palette icon)
- On click, shows a dropdown list of 6 theme options
- Each option shows the theme name and a small color swatch preview (3-4 dots of the theme's key colors)
- Selecting a theme calls `applyTheme()` and saves to localStorage
- Styled consistently with existing LCARS button patterns (pill shapes, font-display, tracking)

### 3. Modify: `src/components/LCARSFrame.tsx`

- Import and place `ThemeSwitcher` in the top bar area, next to the "LCARS" label in the beta-blue panel (or as an additional pill in the top bar row)

### 4. Modify: `src/App.tsx`

- On mount, call `applyTheme(getTheme())` to restore the saved theme before first render

### 5. Modify: `src/index.css`

- No structural changes needed. The `:root` variables remain as the Lower Decks PADD defaults. The theme switcher overrides them at runtime via inline styles on `<html>`.

## Technical Details

- Theme state is purely CSS custom properties -- no React re-render needed for color changes
- `applyTheme` sets properties via `document.documentElement.style.setProperty()`
- localStorage key: `lcars-theme`, values: `lower-decks-padd` | `lower-decks` | `classic` | `classic-ultra` | `nemesis-blue` | `nemesis-blue-ultra`
- The "Standard" vs "Ultra" variants share the same color palette but Ultra uses slightly bolder/brighter values for the primary and accent tokens to increase contrast
- The dropdown uses a simple `useState` toggle (no additional dependency needed), positioned absolutely below the trigger button
- Click-outside closes the dropdown
- Make sure all files are loaded locally

## Files Summary


| File                               | Action                       |
| ---------------------------------- | ---------------------------- |
| `src/lib/themes.ts`                | Create                       |
| `src/components/ThemeSwitcher.tsx` | Create                       |
| `src/components/LCARSFrame.tsx`    | Add ThemeSwitcher to top bar |
| `src/App.tsx`                      | Apply saved theme on mount   |
