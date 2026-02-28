// STA 2nd Edition 2d20 Task System — Pure Logic

export interface StaDieResult {
  value: number;
  successes: number; // 0, 1, or 2
  isCritical: boolean;
  isComplication: boolean;
}

export interface StaRollConfig {
  attribute: number;
  department: number;
  focusOn: boolean;
  complicationRange: number; // e.g. 20 means only 20, 19 means 19-20, etc.
  difficulty: number;
}

export interface StaRollResult {
  dice: StaDieResult[];
  totalSuccesses: number;
  complications: number;
  difficulty: number;
  passed: boolean;
  momentum: number;
}

export interface AssistConfig {
  attribute: number;
  department: number;
  focusOn: boolean;
  complicationRange: number;
}

export function evaluateDie(
  value: number,
  attribute: number,
  department: number,
  focusOn: boolean,
  complicationRange: number
): StaDieResult {
  const tn = attribute + department;
  let successes = 0;
  let isCritical = false;

  if (value === 1) {
    // Natural 1 is always 2 successes (critical)
    successes = 2;
    isCritical = true;
  } else if (focusOn && value <= attribute) {
    // With focus, rolls ≤ attribute score = 2 successes
    successes = 2;
    isCritical = true;
  } else if (value <= tn) {
    successes = 1;
  }

  const isComplication = value >= complicationRange;

  return { value, successes, isCritical, isComplication };
}

export function rollTask(config: StaRollConfig, numDice: number): StaRollResult {
  const dice: StaDieResult[] = [];
  for (let i = 0; i < numDice; i++) {
    const value = Math.floor(Math.random() * 20) + 1;
    dice.push(evaluateDie(value, config.attribute, config.department, config.focusOn, config.complicationRange));
  }

  const totalSuccesses = dice.reduce((sum, d) => sum + d.successes, 0);
  const complications = dice.filter((d) => d.isComplication).length;
  const passed = totalSuccesses >= config.difficulty;
  const momentum = passed ? Math.max(totalSuccesses - config.difficulty, 0) : 0;

  return { dice, totalSuccesses, complications, difficulty: config.difficulty, passed, momentum };
}

export function rollAssistDie(assistConfig: AssistConfig): StaDieResult {
  const value = Math.floor(Math.random() * 20) + 1;
  return evaluateDie(value, assistConfig.attribute, assistConfig.department, assistConfig.focusOn, assistConfig.complicationRange);
}

/** Cumulative cost of buying `count` extra dice: 1st=1, 2nd=2, 3rd=3 → totals 1, 3, 6 */
export function calcBuyCost(count: number): number {
  let total = 0;
  for (let i = 1; i <= count; i++) total += i;
  return total;
}

/** Next die cost (the incremental cost of the next extra die) */
export function nextDieCost(currentExtra: number): number {
  return currentExtra + 1;
}

/** Max extra dice purchasable given a pool size */
export function maxBuyable(pool: number, currentExtra: number, maxTotal: number = 5, baseDice: number = 2): number {
  const maxExtra = maxTotal - baseDice;
  let buyable = 0;
  let remaining = pool;
  for (let i = currentExtra + 1; i <= maxExtra; i++) {
    if (remaining >= i) {
      remaining -= i;
      buyable++;
    } else break;
  }
  return buyable;
}
