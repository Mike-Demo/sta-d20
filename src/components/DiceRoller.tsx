import { useState, useCallback } from "react";
import { Volume2, VolumeX, Info } from "lucide-react";
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
      if (focusOn && d.isSuccess) return sum + 2;
      if (d.isSuccess) return sum + 1;
      return sum;
    }, 0);
  }, [focusOn]);

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
        dice.push(makeDie(Math.floor(Math.random() * 20) + 1));
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
          complicationRange,
          momentum: effectiveSuccesses - difficulty,
        },
        ...prev,
      ].slice(0, 50));
    }, 700);
  }, [numDice, targetNumber, rollId, focusOn, difficulty, complicationRange, momentumBuy, threatBuy, calcSuccesses, makeDie]);

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
      return makeDie(Math.floor(Math.random() * 20) + 1);
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
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Dice Pool
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setNumDice(n)}
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
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Target Number
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetNumber(Math.max(1, targetNumber - 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              −
            </button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center">
              <span className="text-primary font-display text-2xl font-bold">{targetNumber}</span>
            </div>
            <button
              onClick={() => setTargetNumber(Math.min(20, targetNumber + 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Focus toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Focus
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFocusOn(true)}
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
              className={`h-10 px-4 rounded-sm font-display text-sm font-bold tracking-wider transition-all ${
                !focusOn
                  ? "bg-lcars-radioactive text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              OFF
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Difficulty
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDifficulty(Math.max(1, difficulty - 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              −
            </button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center">
              <span className="text-primary font-display text-2xl font-bold">{difficulty}</span>
            </div>
            <button
              onClick={() => setDifficulty(Math.min(5, difficulty + 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Roll button + mute */}
      <div className="flex gap-2">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="flex-1 h-16 bg-lcars-alpha-blue text-primary-foreground font-display text-2xl font-bold tracking-[0.3em] uppercase lcars-pill hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {isRolling ? "SCANNING..." : "ENGAGE"}
        </button>
        <button
          onClick={toggleMute}
          className="h-16 w-16 bg-muted rounded-sm flex items-center justify-center hover:bg-muted/80 transition-all"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-lcars-radioactive" />
          )}
        </button>
      </div>

      {/* Dice display */}
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
                    style={{ animationDelay: `${i * 0.1}s` }}
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
                <button onClick={() => setShowExplain(true)} title="Explain Result">
                  <Info className="w-4 h-4 text-muted-foreground hover:text-lcars-arctic-ice transition-colors" />
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

      {/* Info panel */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Critical</div>
          <div className="text-lcars-gold text-xs mt-1">1 = 2 successes</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Success</div>
          <div className="text-lcars-radioactive text-xs mt-1">≤ {targetNumber} = {focusOn ? "2" : "1"} success{!focusOn ? "" : "es"}</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Complication</div>
          <div className="text-destructive text-xs mt-1">≥ {complicationRange} = complication</div>
        </div>
      </div>

      {/* Advanced Options */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full group">
          <div className="bg-lcars-night-rain h-3 w-2 lcars-pill-left" />
          <span className="text-lcars-arctic-ice font-display text-xs font-bold tracking-[0.2em] uppercase">
            ADVANCED OPTIONS
          </span>
          <div className="bg-lcars-arctic-ice/30 h-px flex-1" />
          <span className="text-muted-foreground text-xs">{showAdvanced ? "▲" : "▼"}</span>
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
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center">
                  <span className="text-primary font-display text-lg font-bold">{complicationRange}</span>
                </div>
                <button
                  onClick={() => setComplicationRange(Math.min(20, complicationRange + 1))}
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAssistOn(true)}
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
                    className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                  >
                    −
                  </button>
                  <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center">
                    <span className="text-primary font-display text-lg font-bold">{shipTN}</span>
                  </div>
                  <button
                    onClick={() => setShipTN(Math.min(20, shipTN + 1))}
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
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center">
                  <span className="text-primary font-display text-lg font-bold">{momentumBuy}</span>
                </div>
                <button
                  onClick={() => setMomentumBuy(Math.min(3, momentumBuy + 1))}
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
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  −
                </button>
                <div className="h-8 w-12 bg-muted rounded-sm flex items-center justify-center">
                  <span className="text-primary font-display text-lg font-bold">{threatBuy}</span>
                </div>
                <button
                  onClick={() => setThreatBuy(Math.min(3, threatBuy + 1))}
                  className="h-8 w-8 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
          complicationRange={complicationRange}
          momentumBuy={momentumBuy}
          threatBuy={threatBuy}
        />
      )}
    </div>
  );
};

export default DiceRoller;
