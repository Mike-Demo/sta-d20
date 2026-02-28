

# Reroll Failed Dice

## Overview
After rolling, allow the user to tap/click on non-success dice (misses) to select them for rerolling. A "REROLL" button appears when at least one die is selected, and rerolling replaces only those dice while keeping the rest.

## How It Works
1. After a roll completes, each **non-success die** (miss, not a complication) becomes tappable/selectable
2. Selected dice get a visual highlight (e.g., a pulsing border or checkmark overlay)
3. A "REROLL" button appears below the dice when any are selected
4. Pressing REROLL re-randomizes only the selected dice, recalculates totals, and updates the display
5. Complications (20s) are **not** selectable -- they stay locked in
6. Successes and criticals are **not** selectable -- they stay locked in
7. Only one reroll is allowed per roll (the REROLL button disappears after use)

## Visual Design
- Selectable (miss) dice: cursor changes to pointer, subtle hover effect
- Selected dice: dashed border + slight scale-up to indicate selection
- Non-selectable dice (successes, crits, complications): no interaction, unchanged appearance
- REROLL button: styled like the ENGAGE button but smaller, appears between the dice and the summary

## Technical Changes

### `src/components/DiceRoller.tsx`
- Add `selectedForReroll: Set<number>` state (tracks indices of selected dice)
- Add `hasRerolled: boolean` state to limit to one reroll
- Add `toggleDieSelection(index)` handler -- only allows selecting non-success, non-complication dice
- Add `rerollSelected()` handler that:
  - Replaces selected dice values with new random rolls
  - Recalculates `totalSuccesses` and `complications`
  - Sets `hasRerolled = true`
  - Clears selection
  - Plays roll sound
- On each new ENGAGE roll, reset `selectedForReroll` and `hasRerolled`
- Make miss dice clickable (onClick toggles selection) when `!hasRerolled`
- Show REROLL button when `selectedForReroll.size > 0`
- History entry logs the final result after any reroll

### Dice display updates
- Miss dice get `cursor-pointer` and an onClick handler when reroll is available
- Selected dice get a `ring-2 ring-lcars-arctic-ice scale-105` style
- Success/crit/complication dice remain non-interactive

