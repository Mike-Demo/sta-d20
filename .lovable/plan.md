
# STA2E Task Resolution Enhancements

## Overview
Add 8 features to the existing DiceRoller while preserving the LCARS frame, color palette, layout structure, and ENGAGE flow exactly as-is. All changes are contained within `DiceRoller.tsx`, `RollHistory.tsx`, and two new small components.

---

## 1. New State Variables (DiceRoller.tsx)

Add to existing state:
- `focusOn: boolean` (default false) -- Focus toggle
- `difficulty: number` (1-5, default 2) -- Difficulty selector
- `complicationRange: number` (default 20) -- Advanced: complication threshold
- `assistOn: boolean` (default false) -- Advanced: assist toggle
- `shipTN: number` (default 10) -- Advanced: ship target number (used when assist ON)
- `momentumBuy: number` (0-3, default 0) -- Advanced: bonus dice from momentum
- `threatBuy: number` (0-3, default 0) -- Advanced: bonus dice from threat
- `showAdvanced: boolean` (default false) -- Collapsible panel state
- `showExplain: boolean` (default false) -- Explain modal visibility

---

## 2. Focus Toggle (Feature 4)

Place inline next to the Target Number control row, within the existing `grid grid-cols-1 sm:grid-cols-2` (change to `sm:grid-cols-3`).

- Label: "FOCUS" in the same `text-muted-foreground text-xs font-bold tracking-widest uppercase` style
- Use two small LCARS-styled buttons: `ON` / `OFF`, highlighting the active one with `bg-lcars-radioactive` vs `bg-muted`
- When Focus is ON: any die with `value <= targetNumber` counts as 2 successes (not just natural 1)
- When Focus is OFF: only natural 1 counts as 2 successes (current behavior)

Update `rollDice` and `rerollSelected` success calculation:
```
if (d.isCritical) return sum + 2;
if (focusOn && d.isSuccess) return sum + 2;  // Focus: all successes are double
if (d.isSuccess) return sum + 1;
```

---

## 3. Difficulty Input (Feature 5)

Add a Difficulty stepper in the controls grid (now `sm:grid-cols-3` with Dice Pool, TN, and a row containing Focus + Difficulty on mobile, or all 4 across on desktop -- actually keep it as a 2x2 grid adding Difficulty and Focus as a second row).

Better layout: Change to `grid grid-cols-2 sm:grid-cols-4 gap-4` to fit all 4 controls: Dice Pool | TN | Focus | Difficulty.

- Difficulty stepper: same style as TN (arctic-ice +/- buttons), range 1-5
- Used only for outcome evaluation, not for changing dice count or roll behavior

---

## 4. Dice State Coloring (Feature 2)

Current colors already match closely. Refine:
- Success: `bg-lcars-radioactive/20 border-lcars-radioactive` (green -- already done)
- Critical: `bg-lcars-alpha-blue/20 border-lcars-alpha-blue` -- change to gold: use `bg-yellow-500/20 border-yellow-500` and text `text-yellow-500` for critical (gold)
- Complication: `bg-destructive/20 border-destructive` (red -- already done)
- Miss (after reroll / locked): `bg-muted border-border opacity-60` with grey text
- Miss (eligible for reroll): add `shadow-[0_0_8px_hsl(var(--lcars-arctic-ice))]` blue glow + cursor-pointer (enhance existing behavior)

Update the die rendering block to distinguish "locked miss" (hasRerolled) from "eligible miss" (!hasRerolled).

---

## 5. Outcome Panel (Feature 1)

After the existing Summary section (successes + complications boxes), add an OUTCOME panel:

```
<div className="bg-muted/50 border border-border rounded-sm p-4 w-full">
  <div className="flex items-center gap-2 mb-2">
    <div className="bg-lcars-beta-blue h-3 w-2 lcars-pill-left" />
    <span className="text-lcars-arctic-ice font-display text-xs font-bold tracking-[0.2em] uppercase">OUTCOME</span>
    <div className="bg-lcars-arctic-ice/30 h-px flex-1" />
    <button onClick={() => setShowExplain(true)}>
      <Info className="w-4 h-4 text-muted-foreground hover:text-lcars-arctic-ice" />
    </button>
  </div>
  <!-- Pass/fail text, momentum generated/shortfall -->
</div>
```

Logic:
- `momentum = totalSuccesses - difficulty` (clamped to 0 minimum for "generated")
- If `totalSuccesses >= difficulty`: show "SUCCESS" in green + "Momentum: {momentum}" 
- If `totalSuccesses < difficulty`: show "FAILURE" in red + "Short by {difficulty - totalSuccesses}"
- If complications > 0: append "+ {complications} Complication(s)" in red
- Factor in `momentumBuy` and `threatBuy` from advanced options as bonus successes

---

## 6. Reroll Visual Clarity (Feature 3)

Enhance existing reroll behavior (already implemented):
- Eligible dice get a blue glow CSS shadow: `shadow-[0_0_8px_hsl(200,100%,70%)]`
- After reroll, misses become grey/locked (opacity-60, no pointer)
- Reroll button already only shows when dice are selected -- no change needed there

---

## 7. Collapsible Advanced Panel (Feature 6)

Add between the Info Panel (crit/success/comp reference) and Ship's Log, using existing Collapsible from radix:

```tsx
<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
  <CollapsibleTrigger className="...lcars bar style...">
    ADVANCED OPTIONS {showAdvanced ? "▲" : "▼"}
  </CollapsibleTrigger>
  <CollapsibleContent>
    - Complication Range stepper (16-20, default 20)
    - Assist toggle (ON/OFF)
    - Ship TN stepper (if Assist ON)
    - Momentum Buy stepper (0-3)
    - Threat Buy stepper (0-3)
  </CollapsibleContent>
</Collapsible>
```

Styled with LCARS bar on left, arctic-ice text, muted background. Each option uses the same stepper/toggle patterns already in the app.

When `complicationRange` changes, update die evaluation: `isComplication = value >= complicationRange` instead of `=== 20`.

Momentum Buy and Threat Buy add bonus successes to the outcome evaluation (not extra dice -- they represent purchased successes).

---

## 8. Ship's Log Enhancements (Feature 7)

Extend `RollHistoryEntry` interface with new fields:
- `difficulty: number`
- `focusOn: boolean`
- `complicationRange: number`
- `momentum: number` (calculated: successes + bonuses - difficulty)

Update the history entry creation in `rollDice` and `rerollSelected` to include these.

Update `RollHistory.tsx` display: append after existing summary line:
```
Diff {entry.difficulty} · Focus {entry.focusOn ? "ON" : "OFF"} · CR {entry.complicationRange}
Momentum: {entry.momentum >= 0 ? `+${entry.momentum}` : entry.momentum}
```

Same text styling, no layout changes.

---

## 9. Explain Result Modal (Feature 8)

Create `src/components/ExplainModal.tsx` using the existing Dialog component:

- Trigger: the info icon button next to the OUTCOME panel header
- Content: LCARS-styled modal with dark background, border
- Shows a line-by-line breakdown of each die:
  - "Die 1: rolled 14 -- Miss (14 > TN 10)"
  - "Die 2: rolled 1 -- Critical Success (natural 1, +2 successes)"
  - etc.
- Then summary: "Total: X successes vs Difficulty Y = PASS/FAIL"
- If momentum/threat buys applied, show those too
- Close button styled as LCARS pill

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/DiceRoller.tsx` | Add focus, difficulty, advanced state; update roll logic for focus + complication range; add outcome panel, advanced collapsible, explain trigger; update history entries |
| `src/components/RollHistory.tsx` | Extend interface with difficulty/focus/complicationRange/momentum fields; display them in each entry |
| `src/components/ExplainModal.tsx` | New file -- LCARS-styled dialog explaining the roll result |
| `src/index.css` | Add a `lcars-glow-blue` utility class for the reroll-eligible dice glow effect |

No changes to `LCARSFrame.tsx`, `WatchDiceRoller.tsx`, color tokens, or overall layout structure.
