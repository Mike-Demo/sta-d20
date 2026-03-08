
# Fix Focus Mechanic with Discipline Support

## The Problem

User feedback (Tony Pi, Kenton Campbell) correctly identifies that Focus is broken. Currently, when Focus is ON, **all** results at or below the Target Number count as 2 successes. This is wrong.

Per STA 2nd Edition rules:
- **Target Number (TN)** = Attribute + Discipline
- **Natural 1** = always 2 successes (critical)
- **Focus ON** = results at or below the **Discipline score** count as 2 successes (instead of just natural 1s)
- All other results at or below TN = 1 success as normal

The app is missing a **Discipline** input, so it has no threshold for the Focus double-success check.

## The Fix

When Focus is toggled ON, reveal a **Discipline stepper** (range 1--5) inline next to the Focus toggle. The success calculation changes from "all hits = 2" to "hits where value is at or below Discipline = 2."

### UI Change (DiceRoller.tsx)

- Add `discipline` state (default 3, range 1--5)
- When Focus is ON, show a small stepper for Discipline right next to or below the Focus toggle, keeping the 4-column grid clean
- When Focus is OFF, the Discipline stepper hides (not needed)

### Logic Changes (DiceRoller.tsx)

Update `calcSuccesses`:
```text
Current:  if focusOn && isSuccess -> +2
Correct:  if focusOn && value <= discipline && isSuccess -> +2
          else if isSuccess -> +1
```

### Info Panel Update (bottom of DiceRoller.tsx)

The "Success" info box currently reads: `<= TN = 2 successes` when Focus is on.
Update to: `<= Disc. X = 2 successes` when Focus is on, showing the actual Discipline value.

### ExplainModal Update

- Pass `discipline` as a new prop
- Update the label for focus successes from `"Focus Success (value <= TN, +2)"` to `"Focus Success (value <= Disc. X, +2)"`
- Non-focus successes that are still hits show as regular `"+1"` successes

### WatchDiceRoller Update

- Add the same Discipline stepper (compact) that appears when Focus would be relevant
- Note: The watch layout currently has no Focus toggle, so this is optional / future work

### RollHistory Update

- Add `discipline` field to `RollHistoryEntry` so the log records what Discipline was used
- Display it in the history entry detail line

## Files Modified

1. **src/components/DiceRoller.tsx** -- Add discipline state, conditional UI, fix calcSuccesses
2. **src/components/ExplainModal.tsx** -- Add discipline prop, fix labels
3. **src/components/RollHistory.tsx** -- Add discipline to interface and display
