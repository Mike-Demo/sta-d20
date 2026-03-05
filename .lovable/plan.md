

# Accessibility Audit Fixes

Based on the human accessibility audit, here are the changes organized by priority.

## 1. Add Headings (h2) to Control Sections

**DiceRoller.tsx**: Convert the plain `<label>` text for each settings group into `<h2>` elements so screen reader users can navigate by heading. Affected sections:
- Dice Pool, Target Number, Focus, Difficulty (main controls)
- Advanced Options (collapsible trigger)
- Ship's Log (already has `<h2>` -- confirmed good)

The `<h2>` elements will keep the same visual styling (small uppercase text) but provide heading-level navigation.

## 2. Add `aria-live="polite"` to Results

**DiceRoller.tsx**: Wrap the results area (dice display + successes + outcome panel) in a container with `aria-live="polite"` so screen readers announce results when a roll completes. The live region will contain a summary like "Rolled 3, 8, 15. 2 successes, 1 complication."

## 3. Move Advanced Options Above the Results

**DiceRoller.tsx**: Reorder the JSX so Advanced Options appears between the controls and the Engage button (or directly after the Engage button but before the dice display area). This prevents screen reader users from missing it by placing all configuration before the output.

New order:
1. Main controls (Dice Pool, TN, Focus, Difficulty)
2. Advanced Options (collapsible)
3. Engage button + mute
4. Info panel (Critical / Success / Complication reference)
5. Results area (dice, outcome, reroll)
6. Ship's Log

## 4. Hide Decorative Elements from Screen Readers

**LCARSFrame.tsx**: Change the decorative LCARS bars from `role="img" aria-label="..."` to `aria-hidden="true"`. The top bar, sidebar, and bottom bar are purely decorative and should be skipped by screen readers. The auditor specifically noted these labels are unnecessary and should be hidden.

Also add `aria-hidden="true"` to decorative icon SVGs (the `<Volume2>`, `<VolumeX>`, `<Info>`, `<ExternalLink>`, `<ChevronDown>` icons that sit next to text labels).

## 5. Add High-Contrast Theme ("Captain Proton")

**src/lib/themes.ts**: Add a new high-contrast theme with dark background and bright yellow/white foreground, inspired by the Captain Proton holodeck program (black-and-white / monochrome). This aids low-vision users.

- Name: "Captain Proton"
- Era: "VOY Holodeck"
- Colors: Near-black background, high-contrast yellow primary, white foreground, monochrome LCARS bars
- Minimum 7:1 contrast ratio (WCAG AAA) for all text

**ThemeSwitcher.tsx**: The new theme ID will appear automatically since it reads from the `themes` object.

## Files Modified

1. **src/components/DiceRoller.tsx** -- headings, aria-live region, reorder layout, aria-hidden on icons
2. **src/components/LCARSFrame.tsx** -- aria-hidden on decorative bars and icons
3. **src/lib/themes.ts** -- add Captain Proton high-contrast theme

