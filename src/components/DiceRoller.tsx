import { useState, useCallback } from "react";
import { secureD20 } from "@/lib/diceRandom";
import { Volume2, VolumeX, Info, ShieldCheck } from "lucide-react";
import RollHistory, { RollHistoryEntry, generateStardate } from "./RollHistory";
import ExplainModal from "./ExplainModal";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { playRollSound, playCriticalSound, playSuccessSound, playComplicationSound, isMuted, setMuted } from "@/lib/sounds";

interface DieResult {
  value: number;
  isSuccess: boolean;
  isCritical: boolean;
  isComplication: boolean;
}

interface RollResult {
  dice: DieResult[];
  totalSuccesses: number;
  complications: number;
}

const DiceRoller = () => {
  const [numDice, setNumDice] = useState(2);
  const [targetNumber, setTargetNumber] = useState(10);
  const [focusOn, setFocusOn] = useState(false);
  const [discipline, setDiscipline] = useState(3);
  const [difficulty, setDifficulty] = useState(2);

  // Advanced options
  const [complicationRange, setComplicationRange] = useState(20);
  const [assistOn, setAssistOn] = useState(false);
  const [shipTN, setShipTN] = useState(10);
  const [momentumBuy, setMomentumBuy] = useState(0);
  const [threatBuy, setThreatBuy] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [result, setResult] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [rollId, setRollId] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const [selectedForReroll, setSelectedForReroll] = useState<Set<number>>(new Set());
  const [hasRerolled, setHasRerolled] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  const calcSuccesses = useCallback((dice: DieResult[]) => {
    return dice.reduce((sum, d) => {
      if (d.isCritical) return sum + 2;
      if (focusOn && d.isSuccess && d.value <= discipline) return sum + 2;
      if (d.isSuccess) return sum + 1;
      return sum;
    }, 0);
  }, [focusOn, discipline]);

  const makeDie = useCallback((value: number): DieResult => ({
    value,
    isCritical: value === 1,
    isSuccess: value <= targetNumber,
    isComplication: value >= complicationRange,
  }), [targetNumber, complicationRange]);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setResult(null);
    setSelectedForReroll(new Set());
    setHasRerolled(false);
    playRollSound();

    setTimeout(() => {
      const dice: DieResult[] = [];
      for (let i = 0; i < numDice; i++) {
        dice.push(makeDie(secureD20()));
      }

      const totalSuccesses = calcSuccesses(dice);
      const complications = dice.filter((d) => d.isComplication).length;
      const bonusSuccesses = momentumBuy + threatBuy;
      const effectiveSuccesses = totalSuccesses + bonusSuccesses;

      const rollResult = { dice, totalSuccesses, complications };
      setResult(rollResult);
      setIsRolling(false);

      // Play outcome sounds
      const hasCritical = dice.some((d) => d.isCritical);
      const hasComplication = dice.some((d) => d.isComplication);
      if (hasCritical) {
        playCriticalSound();
      } else if (totalSuccesses > 0) {
        playSuccessSound();
      }
      if (hasComplication) {
        setTimeout(() => playComplicationSound(), hasCritical || totalSuccesses > 0 ? 400 : 0);
      }

      setRollId((prev) => prev + 1);
      setHistory((prev) => [
        {
          id: rollId + 1,
          stardate: generateStardate(),
          numDice,
          targetNumber,
          totalSuccesses,
          complications,
          dice,
          timestamp: new Date(),
          difficulty,
          focusOn,
          discipline,
          complicationRange,
          momentum: effectiveSuccesses - difficulty,
        },
        ...prev,
      ].slice(0, 50));
    }, 700);
  }, [numDice, targetNumber, rollId, focusOn, discipline, difficulty, complicationRange, momentumBuy, threatBuy, calcSuccesses, makeDie]);

  const toggleDieSelection = useCallback((index: number) => {
    if (!result || hasRerolled) return;
    const die = result.dice[index];
    if (die.isSuccess || die.isCritical || die.isComplication) return;
    setSelectedForReroll((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, [result, hasRerolled]);

  const rerollSelected = useCallback(() => {
    if (!result || selectedForReroll.size === 0) return;
    playRollSound();

    const newDice = result.dice.map((die, i) => {
      if (!selectedForReroll.has(i)) return die;
      return makeDie(secureD20());
    });

    const totalSuccesses = calcSuccesses(newDice);
    const complications = newDice.filter((d) => d.isComplication).length;
    const bonusSuccesses = momentumBuy + threatBuy;
    const effectiveSuccesses = totalSuccesses + bonusSuccesses;

    const newResult = { dice: newDice, totalSuccesses, complications };
    setResult(newResult);
    setSelectedForReroll(new Set());
    setHasRerolled(true);

    // Play outcome sounds
    const hasCritical = newDice.some((d) => d.isCritical);
    const hasComplication = newDice.some((d) => d.isComplication);
    if (hasCritical) playCriticalSound();
    else if (totalSuccesses > 0) playSuccessSound();
    if (hasComplication) setTimeout(() => playComplicationSound(), hasCritical || totalSuccesses > 0 ? 400 : 0);

    // Update history
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        dice: newDice,
        totalSuccesses,
        complications,
        momentum: effectiveSuccesses - difficulty,
      };
      return updated;
    });
  }, [result, selectedForReroll, calcSuccesses, makeDie, momentumBuy, threatBuy, difficulty]);

  // Outcome calculations
  const bonusSuccesses = momentumBuy + threatBuy;
  const effectiveSuccesses = result ? result.totalSuccesses + bonusSuccesses : 0;
  const passed = effectiveSuccesses >= difficulty;
  const momentumGenerated = effectiveSuccesses - difficulty;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Number of dice */}
        <div className="flex flex-col gap-2">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Dice Pool
          </h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setNumDice(n)}
                aria-label={`Roll ${n} ${n === 1 ? "die" : "dice"}`}
                aria-pressed={numDice === n}
                className={`h-10 w-10 rounded-sm font-display text-lg font-bold transition-all ${
                  numDice === n
                    ? "bg-lcars-alpha-blue text-primary-foreground scale-110"
                    : "bg-muted text-muted-foreground hover:bg-lcars-beta-blue hover:text-primary-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Target number */}
        <div className="flex flex-col gap-2">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Target Number
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetNumber(Math.max(1, targetNumber - 1))}
              aria-label="Decrease target number"
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              −
            </button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Target number: ${targetNumber}`}>
              <span className="text-primary font-display text-2xl font-bold">{targetNumber}</span>
            </div>
            <button
              onClick={() => setTargetNumber(Math.min(20, targetNumber + 1))}
              aria-label="Increase target number"
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Focus toggle + Discipline */}
        <div className="flex flex-col gap-2">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Focus
          </h2>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Focus toggle">
            <button
              onClick={() => setFocusOn(true)}
              role="radio"
              aria-checked={focusOn}
              aria-label="Focus on"
              className={`h-10 px-4 rounded-sm font-display text-sm font-bold tracking-wider transition-all ${
                focusOn
                  ? "bg-lcars-radioactive text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              ON
            </button>
            <button
              onClick={() => setFocusOn(false)}
              role="radio"
              aria-checked={!focusOn}
              aria-label="Focus off"
              className={`h-10 px-4 rounded-sm font-display text-sm font-bold tracking-wider transition-all ${
                !focusOn
                  ? "bg-lcars-radioactive text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              OFF
            </button>
          </div>
          {focusOn && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">Disc.</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setDiscipline(n)}
                  aria-label={`Discipline ${n}`}
                  aria-pressed={discipline === n}
                  className={`h-7 w-7 rounded-sm font-display text-xs font-bold transition-all ${
                    discipline === n
                      ? "bg-lcars-gold text-accent-foreground scale-110"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Difficulty
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDifficulty(Math.max(1, difficulty - 1))}
              aria-label="Decrease difficulty"
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              −
            </button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Difficulty: ${difficulty}`}>
              <span className="text-primary font-display text-2xl font-bold">{difficulty}</span>
            </div>
            <button
              onClick={() => setDifficulty(Math.min(5, difficulty + 1))}
              aria-label="Increase difficulty"
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Options — placed before results for screen reader discoverability */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full group">
          <div className="bg-lcars-night-rain h-3 w-2 lcars-pill-left" />
          <h2 className="text-lcars-arctic-ice font-display text-xs font-bold tracking-[0.2em] uppercase">
            ADVANCED OPTIONS
          </h2>
          <div className="bg-lcars-arctic-ice/30 h-px flex-1" />
          <span className="text-muted-foreground text-xs" aria-hidden="true">{showAdvanced ? "▲" : "▼"}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="bg-muted/50 border border-border rounded-sm p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Complication Range */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Complication Range
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setComplicationRange(Math.max(16, complicationRange - 1))}
                  aria-label="Decrease complication range"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Complication range: ${complicationRange}`}>
                  <span className="text-primary font-display text-lg font-bold">{complicationRange}</span>
                </div>
                <button
                  onClick={() => setComplicationRange(Math.min(20, complicationRange + 1))}
                  aria-label="Increase complication range"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Assist toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Assist
              </label>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Assist toggle">
                <button
                  onClick={() => setAssistOn(true)}
                  role="radio"
                  aria-checked={assistOn}
                  aria-label="Assist on"
                  className={`h-8 px-3 rounded-sm font-display text-xs font-bold tracking-wider transition-all ${
                    assistOn
                      ? "bg-lcars-radioactive text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  ON
                </button>
                <button
                  onClick={() => setAssistOn(false)}
                  role="radio"
                  aria-checked={!assistOn}
                  aria-label="Assist off"
                  className={`h-8 px-3 rounded-sm font-display text-xs font-bold tracking-wider transition-all ${
                    !assistOn
                      ? "bg-lcars-radioactive text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  OFF
                </button>
              </div>
            </div>

            {/* Ship TN (only when assist ON) */}
            {assistOn && (
              <div className="flex flex-col gap-2">
                <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Ship TN
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShipTN(Math.max(1, shipTN - 1))}
                    aria-label="Decrease ship target number"
                    className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                  >
                    −
                  </button>
                  <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Ship target number: ${shipTN}`}>
                    <span className="text-primary font-display text-lg font-bold">{shipTN}</span>
                  </div>
                  <button
                    onClick={() => setShipTN(Math.min(20, shipTN + 1))}
                    aria-label="Increase ship target number"
                    className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Momentum Buy */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Momentum Buy
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMomentumBuy(Math.max(0, momentumBuy - 1))}
                  aria-label="Decrease momentum buy"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Momentum buy: ${momentumBuy}`}>
                  <span className="text-primary font-display text-lg font-bold">{momentumBuy}</span>
                </div>
                <button
                  onClick={() => setMomentumBuy(Math.min(3, momentumBuy + 1))}
                  aria-label="Increase momentum buy"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Threat Buy */}
            <div className="flex flex-col gap-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Threat Buy
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setThreatBuy(Math.max(0, threatBuy - 1))}
                  aria-label="Decrease threat buy"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center" role="status" aria-label={`Threat buy: ${threatBuy}`}>
                  <span className="text-primary font-display text-lg font-bold">{threatBuy}</span>
                </div>
                <button
                  onClick={() => setThreatBuy(Math.min(3, threatBuy + 1))}
                  aria-label="Increase threat buy"
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Roll button + mute */}
      <div className="flex gap-2">
        <button
          onClick={rollDice}
          disabled={isRolling}
          aria-label={isRolling ? "Scanning, rolling dice" : "Engage, roll dice"}
          className="flex-1 h-16 bg-lcars-alpha-blue text-primary-foreground font-display text-2xl font-bold tracking-[0.3em] uppercase lcars-pill hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {isRolling ? "SCANNING..." : "ENGAGE"}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
          className="h-16 w-16 bg-muted rounded-sm flex items-center justify-center hover:bg-muted/80 transition-all"
        >
          {muted ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Volume2 className="h-5 w-5 text-lcars-radioactive" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Critical</div>
          <div className="text-lcars-gold text-xs mt-1">1 = 2 successes</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Success</div>
          <div className="text-lcars-radioactive text-xs mt-1">{focusOn ? `≤ Disc. ${discipline} = 2 successes` : `≤ ${targetNumber} = 1 success`}</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Complication</div>
          <div className="text-destructive text-xs mt-1">≥ {complicationRange} = complication</div>
        </div>
      </div>

      {/* Results area — aria-live so screen readers announce outcomes */}
      <div aria-live="polite" aria-atomic="true">
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-6">
          {isRolling && (
            <div className="flex gap-3">
              {Array.from({ length: numDice }).map((_, i) => (
                <div
                  key={i}
                  className="dice-rolling h-16 w-16 bg-muted rounded-lg flex items-center justify-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-primary font-display text-2xl font-bold">?</span>
                </div>
              ))}
            </div>
          )}

          {result && !isRolling && (
            <>
              {/* Screen reader summary */}
              <div className="sr-only">
                Rolled {result.dice.map(d => d.value).join(", ")}. {result.totalSuccesses} {result.totalSuccesses === 1 ? "success" : "successes"}{result.complications > 0 ? `, ${result.complications} ${result.complications === 1 ? "complication" : "complications"}` : ""}. {passed ? `Success, momentum plus ${momentumGenerated}` : `Failure, short by ${Math.abs(momentumGenerated)}`}.
              </div>

              {/* Individual dice */}
              <div className="flex flex-wrap gap-3 justify-center">
                {result.dice.map((die, i) => {
                  const isMiss = !die.isSuccess && !die.isCritical && !die.isComplication;
                  const isSelectable = isMiss && !hasRerolled;
                  const isLockedMiss = isMiss && hasRerolled;
                  const isSelected = selectedForReroll.has(i);
                  return (
                    <div
                      key={i}
                      onClick={isSelectable ? () => toggleDieSelection(i) : undefined}
                      className={`result-pop h-16 w-16 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                        die.isComplication
                          ? "bg-destructive/20 border-destructive"
                          : die.isCritical
                          ? "bg-lcars-gold/20 border-lcars-gold"
                          : die.isSuccess
                          ? "bg-lcars-radioactive/20 border-lcars-radioactive"
                          : isSelected
                          ? "bg-muted border-dashed border-lcars-arctic-ice scale-105"
                          : isLockedMiss
                          ? "bg-muted border-border opacity-60"
                          : "bg-muted border-border"
                      } ${isSelectable && !isSelected ? "cursor-pointer hover:border-lcars-arctic-ice/50 lcars-glow-blue" : ""}`}
                      aria-label={`Die ${i + 1}: rolled ${die.value}, ${die.isComplication ? "complication" : die.isCritical ? "critical success" : die.isSuccess ? "success" : "miss"}${isSelectable ? ", click to select for reroll" : ""}`}
                    >
                      <span
                        className={`font-display text-2xl font-bold ${
                          die.isComplication
                            ? "text-destructive"
                            : die.isCritical
                            ? "text-lcars-gold"
                            : die.isSuccess
                            ? "text-lcars-radioactive"
                            : isLockedMiss
                            ? "text-muted-foreground/50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {die.value}
                      </span>
                      <span className="text-[8px] font-bold tracking-wider text-muted-foreground uppercase">
                        {die.isComplication
                          ? "COMP"
                          : die.isCritical
                          ? "CRIT"
                          : die.isSuccess
                          ? "HIT"
                          : "MISS"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reroll button */}
              {selectedForReroll.size > 0 && (
                <button
                  onClick={rerollSelected}
                  aria-label={`Reroll ${selectedForReroll.size} selected ${selectedForReroll.size === 1 ? "die" : "dice"}`}
                  className="h-10 px-8 bg-lcars-arctic-ice text-accent-foreground font-display text-sm font-bold tracking-[0.2em] uppercase lcars-pill hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  REROLL ({selectedForReroll.size})
                </button>
              )}

              {/* Summary */}
              <div className="flex gap-4 items-center">
                <div className="bg-lcars-radioactive/20 border border-lcars-radioactive rounded-sm px-6 py-3 text-center">
                  <div className="text-lcars-radioactive font-display text-4xl font-bold">
                    {result.totalSuccesses}
                  </div>
                  <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Successes
                  </div>
                </div>
                {result.complications > 0 && (
                  <div className="bg-destructive/20 border border-destructive rounded-sm px-6 py-3 text-center result-pop">
                    <div className="text-destructive font-display text-4xl font-bold">
                      {result.complications}
                    </div>
                    <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      Complications
                    </div>
                  </div>
                )}
              </div>

              {/* Outcome Panel */}
              <div className="bg-muted/50 border border-border rounded-sm p-4 w-full result-pop">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-lcars-beta-blue h-3 w-2 lcars-pill-left" />
                  <span className="text-lcars-arctic-ice font-display text-xs font-bold tracking-[0.2em] uppercase">
                    OUTCOME
                  </span>
                  <div className="bg-lcars-arctic-ice/30 h-px flex-1" />
                  <button onClick={() => setShowExplain(true)} aria-label="Explain roll result breakdown" title="Explain Result">
                    <Info className="w-4 h-4 text-muted-foreground hover:text-lcars-arctic-ice transition-colors" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm font-display font-bold">
                  <span className={passed ? "text-lcars-radioactive" : "text-destructive"}>
                    {passed ? "SUCCESS" : "FAILURE"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {passed
                      ? `Momentum: +${momentumGenerated}`
                      : `Short by ${Math.abs(momentumGenerated)}`}
                  </span>
                  {result.complications > 0 && (
                    <span className="text-destructive text-xs">
                      + {result.complications} Complication{result.complications !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {!result && !isRolling && (
            <div className="text-muted-foreground text-center">
              <p className="font-display text-lg tracking-wider uppercase lcars-blink">
                Awaiting Orders
              </p>
              <p className="text-xs mt-2 tracking-wide">
                Set your parameters and press ENGAGE
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ship's Log */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-lcars-beta-blue h-4 w-2 lcars-pill-left" />
          <h2 className="text-lcars-arctic-ice font-display text-sm font-bold tracking-[0.3em] uppercase">
            Ship's Log
          </h2>
          <div className="bg-lcars-arctic-ice/30 h-px flex-1" />
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              aria-label="Clear roll history"
              className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase hover:text-destructive transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>
        <RollHistory entries={history} />
      </div>

      {/* Explain Modal */}
      {result && (
        <ExplainModal
          open={showExplain}
          onOpenChange={setShowExplain}
          dice={result.dice}
          targetNumber={targetNumber}
          totalSuccesses={result.totalSuccesses}
          complications={result.complications}
          difficulty={difficulty}
          focusOn={focusOn}
          discipline={discipline}
          complicationRange={complicationRange}
          momentumBuy={momentumBuy}
          threatBuy={threatBuy}
        />
      )}
    </div>
  );
};

export default DiceRoller;
