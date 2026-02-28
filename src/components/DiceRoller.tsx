import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import RollHistory, { RollHistoryEntry, generateStardate } from "./RollHistory";
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
  
  const [result, setResult] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [rollId, setRollId] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const [selectedForReroll, setSelectedForReroll] = useState<Set<number>>(new Set());
  const [hasRerolled, setHasRerolled] = useState(false);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setResult(null);
    setSelectedForReroll(new Set());
    setHasRerolled(false);
    playRollSound();

    setTimeout(() => {
      const dice: DieResult[] = [];
      for (let i = 0; i < numDice; i++) {
        const value = Math.floor(Math.random() * 20) + 1;
        const isCritical = value === 1;
        const isSuccess = value <= targetNumber;
        const isComplication = value === 20;
        dice.push({ value, isSuccess, isCritical, isComplication });
      }

      const totalSuccesses = dice.reduce((sum, d) => {
        if (d.isCritical) return sum + 2;
        if (d.isSuccess) return sum + 1;
        return sum;
      }, 0);

      const complications = dice.filter((d) => d.isComplication).length;

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
        },
        ...prev,
      ].slice(0, 50));
    }, 700);
  }, [numDice, targetNumber, rollId]);

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
      const value = Math.floor(Math.random() * 20) + 1;
      const isCritical = value === 1;
      const isSuccess = value <= targetNumber;
      const isComplication = value === 20;
      return { value, isSuccess, isCritical, isComplication };
    });

    const totalSuccesses = newDice.reduce((sum, d) => {
      if (d.isCritical) return sum + 2;
      if (d.isSuccess) return sum + 1;
      return sum;
    }, 0);
    const complications = newDice.filter((d) => d.isComplication).length;

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

    // Update history (replace most recent entry with final result)
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = { ...updated[0], dice: newDice, totalSuccesses, complications };
      return updated;
    });
  }, [result, selectedForReroll, targetNumber]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="h-10 w-10 bg-lcars-arctic-ice text-primary-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >
              −
            </button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center">
              <span className="text-primary font-display text-2xl font-bold">{targetNumber}</span>
            </div>
            <button
              onClick={() => setTargetNumber(Math.min(20, targetNumber + 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-primary-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
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
                const isSelected = selectedForReroll.has(i);
                return (
                  <div
                    key={i}
                    onClick={isSelectable ? () => toggleDieSelection(i) : undefined}
                    className={`result-pop h-16 w-16 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                      die.isComplication
                        ? "bg-destructive/20 border-destructive"
                        : die.isCritical
                        ? "bg-lcars-alpha-blue/20 border-lcars-alpha-blue"
                        : die.isSuccess
                        ? "bg-lcars-radioactive/20 border-lcars-radioactive"
                        : isSelected
                        ? "bg-muted border-dashed border-lcars-arctic-ice scale-105"
                        : "bg-muted border-border"
                    } ${isSelectable ? "cursor-pointer hover:border-lcars-arctic-ice/50" : ""}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span
                      className={`font-display text-2xl font-bold ${
                        die.isComplication
                          ? "text-destructive"
                          : die.isCritical
                          ? "text-lcars-alpha-blue"
                          : die.isSuccess
                          ? "text-lcars-radioactive"
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
          <div className="text-lcars-alpha-blue text-xs mt-1">1 = 2 successes</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Success</div>
          <div className="text-lcars-radioactive text-xs mt-1">≤ {targetNumber} = 1 success</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Complication</div>
          <div className="text-destructive text-xs mt-1">20 = complication</div>
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
              className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase hover:text-destructive transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>
        <RollHistory entries={history} />
      </div>
    </div>
  );
};

export default DiceRoller;
