
# STA 2nd Edition Full 2d20 Task System

## Overview
Extend the existing DiceRoller component with proper STA 2e task mechanics while preserving the LCARS frame, styling, and all existing components. The core change is replacing the simplified controls with proper Attribute/Department/Focus/Difficulty/Complication Range inputs, adding Momentum and Threat economy, and adding an Assist roll option.

## Architecture

The DiceRoller is currently a single monolithic component (~320 lines). To keep it manageable, we will extract game logic into a shared module and break the UI into sub-components.

### New files
- `src/lib/sta-dice.ts` -- Pure logic: types, roll evaluation, success calculation, economy rules
- `src/components/TaskControls.tsx` -- Attribute, Department, Focus, Difficulty, Complication Range inputs
- `src/components/EconomyPanel.tsx` -- Momentum pool (0-6), Threat counter (0+), buy-dice UI
- `src/components/AssistPanel.tsx` -- Toggle + Assist Attribute/Department inputs
- `src/components/RollResultPanel.tsx` -- Enhanced results display (per-die breakdown, pass/fail, momentum generated)

### Modified files
- `src/components/DiceRoller.tsx` -- Integrate new sub-components, replace old controls, update roll logic
- `src/components/RollHistory.tsx` -- Extend entry type with difficulty, momentum, pass/fail
- `src/components/WatchDiceRoller.tsx` -- Update logic to use shared `sta-dice.ts` (keep compact UI)

---

## Detailed Changes

### 1. `src/lib/sta-dice.ts` (new)

Pure functions and types for STA 2e mechanics:

```text
Types:
  - StaDieResult: { value, successes (0/1/2), isCritical, isComplication }
  - StaRollConfig: { attribute, department, focusOn, complicationRange, difficulty }
  - StaRollResult: { dice, totalSuccesses, complications, difficulty, passed, momentum }
  - AssistConfig: { attribute, department, focusOn }

Functions:
  - evaluateDie(value, tn, focusOn, attribute, complicationRange) -> StaDieResult
    * TN = attribute + department
    * If focusOn: rolls <= attribute = 2 successes (critical)
    * If !focusOn: only natural 1 = 2 successes
    * Roll <= TN = 1 success
    * Roll >= complicationRange = complication
  - rollTask(config, numDice) -> StaRollResult
  - rollAssist(assistConfig) -> { die: StaDieResult }
  - calcBuyCost(extraDiceCount) -> total cost (1st=1, 2nd=2, 3rd=3)
  - canBuyDice(currentPool, maxTotal=5, baseDice=2) -> max purchasable
```

### 2. `src/components/TaskControls.tsx` (new)

Replaces the old Dice Pool / Target Number / Focus Range controls. Laid out in the existing grid pattern using LCARS styling:

- **Attribute** (1-12): stepper with +/- buttons (styled like current TN control, using `bg-lcars-arctic-ice`)
- **Department** (1-12): stepper (same style)
- **Auto-calculated TN**: displayed read-only (Attribute + Department), highlighted
- **Focus toggle**: on/off switch styled as an LCARS button (uses `bg-lcars-radioactive` when on, `bg-muted` when off)
- **Difficulty** (0-5): button row like current dice pool selector
- **Complication Range**: selector buttons for 20, 19-20, 18-20, 17-20

### 3. `src/components/EconomyPanel.tsx` (new)

Persistent counters displayed below the controls:

- **Momentum Pool** (0-6): LCARS-styled counter with +/- buttons. Color: `lcars-radioactive`
- **Threat Pool** (0+): counter with +/- buttons. Color: `destructive`
- **Buy Extra Dice** section:
  - Shows how many extra dice can be bought (max 5 total - base 2 = up to 3 extra)
  - Two buttons: "Buy with Momentum" / "Buy with Threat"
  - Displays cost (1st=1, 2nd=2, 3rd=3 cumulative)
  - Buying with Momentum subtracts from pool; buying with Threat adds to pool
  - Disabled when pool is insufficient or at 5 dice cap

### 4. `src/components/AssistPanel.tsx` (new)

Collapsible section below the economy panel:

- **Assist toggle**: when enabled, shows Assist Attribute (1-12) and Assist Department (1-12) steppers
- When rolling, an extra 1d20 is rolled for the assistant using their own TN
- Assist successes are added to the leader's total
- Complication rules apply to the assist die too

### 5. `src/components/RollResultPanel.tsx` (new)

Enhanced version of the current dice display area:

- Per-die display (same visual style) now shows success count per die (0, 1, or 2) instead of just HIT/MISS
- Summary section expanded:
  - Total successes (existing)
  - Difficulty threshold shown
  - **PASS / FAIL** indicator (large, color-coded)
  - **Momentum generated** = max(successes - difficulty, 0) -- shown only on pass
  - Complication summary (existing)
  - If assist die was rolled, shown separately labeled "ASSIST"
- Prompt: "Add X momentum to pool?" button (only on pass with momentum > 0), capped at 6

### 6. `src/components/DiceRoller.tsx` (modified)

- Replace state: remove `targetNumber`, `focusRange`; add `attribute` (default 8), `department` (default 2), `focusOn` (default false), `difficulty` (default 1), `complicationRange` (default 20), `momentumPool` (default 0), `threatPool` (default 0), `assistEnabled` (default false), `assistAttribute` (default 7), `assistDepartment` (default 1), `extraDice` (default 0)
- `numDice` becomes computed: base 2 + extraDice (capped at 5)
- Roll logic calls `rollTask()` and optionally `rollAssist()` from `sta-dice.ts`
- Replace control sections with `<TaskControls>`, `<EconomyPanel>`, `<AssistPanel>`
- Replace result display with `<RollResultPanel>`
- Keep Ship's Log, mute button, roll button, sound effects, and all LCARS styling intact

### 7. `src/components/RollHistory.tsx` (modified)

- Extend `RollHistoryEntry` with: `difficulty`, `passed`, `momentum`, `assistDie?`
- Display pass/fail badge and momentum in each log entry
- Keep existing layout and colors

### 8. `src/components/WatchDiceRoller.tsx` (modified)

- Import shared logic from `sta-dice.ts`
- Replace TN/Focus steppers with Attribute/Department/Focus toggle (compact)
- Add difficulty stepper
- Show pass/fail in results
- Keep minimal watch-friendly layout

---

## UI Layout (top to bottom in main content area)

```text
+--------------------------------------------------+
| TASK PARAMETERS                                   |
| [Attribute: 8]  [Department: 2]  TN: 10 (auto)  |
| [Focus: OFF]  [Difficulty: 0 1 2 3 4 5]         |
| [Complication: 20 | 19-20 | 18-20 | 17-20]      |
+--------------------------------------------------+
| ECONOMY                                           |
| Momentum [0] [+][-]    Threat [0] [+][-]         |
| Extra Dice: [+Momentum][+Threat] (cost shown)    |
| Dice Pool: 2 base + 0 extra = 2                  |
+--------------------------------------------------+
| ASSIST (collapsible)                              |
| [x] Enable  Attr: [7]  Dept: [1]                |
+--------------------------------------------------+
| [ ====== ENGAGE ====== ] [mute]                  |
+--------------------------------------------------+
| RESULTS                                           |
| [die] [die] ... [assist die]                     |
| Successes: 3  |  Difficulty: 2  |  PASS          |
| Momentum: 1   |  Complications: 0                |
| [Add 1 to Momentum Pool]                         |
+--------------------------------------------------+
| Info panel (updated rules reference)              |
+--------------------------------------------------+
| Ship's Log (with pass/fail + momentum)            |
+--------------------------------------------------+
```

## What stays unchanged
- LCARSFrame component (no changes)
- SplashScreen
- All external links and footer
- LCARS color tokens and CSS animations
- Sound effect system (same triggers, same sounds)
- NavLink component
- All UI library components (shadcn/ui)
