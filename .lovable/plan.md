

# Fix: Assist Die Actually Rolls

## Problem
The Assist toggle and Ship TN stepper in Advanced Options are purely cosmetic. The `rollDice` function ignores both values entirely. Users expect toggling Assist ON to roll an additional d20 evaluated against the Ship TN.

## STA 2e Assist Rules
When a character receives assistance (from the ship or another character), one additional d20 is rolled. That die is evaluated against the **assisting character's TN** (here, "Ship TN"), not the primary TN. Focus/crit rules still apply (natural 1 = 2 successes).

## Changes

### `src/components/DiceRoller.tsx`

1. **In `rollDice`** (around line 76-80): After rolling the main dice pool, if `assistOn` is true, roll one extra d20 evaluated against `shipTN` (instead of `targetNumber`) for success, but still using `complicationRange` for complications. Push it onto the dice array. Mark it distinctly so it can be identified as the assist die.

2. **In `rerollSelected`**: Same logic -- if the assist die is being rerolled, evaluate it against `shipTN`.

3. **Update `DieResult` interface**: Add an optional `isAssist?: boolean` flag so the UI can label/style the assist die differently.

4. **Update `makeDie`**: Accept an optional TN override parameter so the assist die uses `shipTN` instead of the component's `targetNumber`.

5. **In the dice display section**: Visually distinguish the assist die (e.g., a subtle label or different border color) so users know which die is the assist.

### `src/components/RollHistory.tsx` / `ExplainModal.tsx`
- The explain modal should label the assist die appropriately in its breakdown (e.g., "Assist Die — Success (5 ≤ Ship TN 10, +1)").

## What This Does NOT Change
- No new UI controls added -- the existing Assist toggle and Ship TN stepper already exist
- The community request for "different crit threshold for the assist die" is a separate feature (not addressed here -- just fixing the core bug)

