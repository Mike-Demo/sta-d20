

# Replace Math.random() with Crypto API

## What

Replace all `Math.floor(Math.random() * 20) + 1` calls with a helper using `crypto.getRandomValues()` for cryptographically secure d20 rolls.

## How

### 1. Create helper function in `src/lib/diceRandom.ts`

```typescript
export function secureD20(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 20) + 1;
}
```

### 2. Update `src/components/DiceRoller.tsx`

Replace both occurrences of `Math.floor(Math.random() * 20) + 1` with `secureD20()`:
- Line ~77 (initial roll loop)
- Line ~141 (reroll loop)

### 3. Update `src/components/WatchDiceRoller.tsx`

Replace `Math.floor(Math.random() * 20) + 1` on line ~25 with `secureD20()`.

### Files

- **New**: `src/lib/diceRandom.ts`
- **Edit**: `src/components/DiceRoller.tsx` (2 replacements + import)
- **Edit**: `src/components/WatchDiceRoller.tsx` (1 replacement + import)

