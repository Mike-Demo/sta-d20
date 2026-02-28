import type { StaDieResult, StaRollResult } from "@/lib/sta-dice";

interface RollResultPanelProps {
  result: StaRollResult;
  assistDie: StaDieResult | null;
  momentumPool: number;
  onAddMomentum: (amount: number) => void;
  isRolling: boolean;
  numDice: number;
}

const RollResultPanel = ({
  result, assistDie, momentumPool, onAddMomentum, isRolling, numDice,
}: RollResultPanelProps) => {
  if (isRolling) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="flex gap-3">
          {Array.from({ length: numDice + (assistDie ? 1 : 0) }).map((_, i) => (
            <div
              key={i}
              className="dice-rolling h-16 w-16 bg-muted rounded-lg flex items-center justify-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-primary font-display text-2xl font-bold">?</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalWithAssist = result.totalSuccesses + (assistDie?.successes ?? 0);
  const assistComplication = assistDie?.isComplication ? 1 : 0;
  const totalComplications = result.complications + assistComplication;
  const passed = totalWithAssist >= result.difficulty;
  const momentum = passed ? Math.max(totalWithAssist - result.difficulty, 0) : 0;
  const canAddMomentum = passed && momentum > 0 && momentumPool < 6;
  const addableAmount = Math.min(momentum, 6 - momentumPool);

  const dieClass = (die: StaDieResult) => {
    if (die.isComplication)
      return "bg-destructive/20 border-destructive";
    if (die.isCritical)
      return "bg-lcars-alpha-blue/20 border-lcars-alpha-blue";
    if (die.successes > 0)
      return "bg-lcars-radioactive/20 border-lcars-radioactive";
    return "bg-muted border-border";
  };

  const dieTextClass = (die: StaDieResult) => {
    if (die.isComplication) return "text-destructive";
    if (die.isCritical) return "text-lcars-alpha-blue";
    if (die.successes > 0) return "text-lcars-radioactive";
    return "text-muted-foreground";
  };

  const dieLabel = (die: StaDieResult) => {
    if (die.isComplication) return "COMP";
    if (die.isCritical) return `×2`;
    if (die.successes > 0) return "×1";
    return "MISS";
  };

  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center gap-6">
      {/* Individual dice */}
      <div className="flex flex-wrap gap-3 justify-center">
        {result.dice.map((die, i) => (
          <div
            key={i}
            className={`result-pop h-16 w-16 rounded-lg flex flex-col items-center justify-center border-2 ${dieClass(die)}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className={`font-display text-2xl font-bold ${dieTextClass(die)}`}>{die.value}</span>
            <span className="text-[8px] font-bold tracking-wider text-muted-foreground uppercase">{dieLabel(die)}</span>
          </div>
        ))}
        {assistDie && (
          <div className={`result-pop h-16 w-16 rounded-lg flex flex-col items-center justify-center border-2 border-dashed ${dieClass(assistDie)}`}>
            <span className={`font-display text-2xl font-bold ${dieTextClass(assistDie)}`}>{assistDie.value}</span>
            <span className="text-[8px] font-bold tracking-wider text-lcars-arctic-ice uppercase">ASST</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <div className="bg-lcars-radioactive/20 border border-lcars-radioactive rounded-sm px-5 py-3 text-center">
          <div className="text-lcars-radioactive font-display text-3xl font-bold">{totalWithAssist}</div>
          <div className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">Successes</div>
        </div>

        <div className="bg-muted border border-border rounded-sm px-5 py-3 text-center">
          <div className="text-primary font-display text-3xl font-bold">{result.difficulty}</div>
          <div className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">Difficulty</div>
        </div>

        <div className={`rounded-sm px-5 py-3 text-center border ${
          passed
            ? "bg-lcars-radioactive/20 border-lcars-radioactive"
            : "bg-destructive/20 border-destructive"
        }`}>
          <div className={`font-display text-2xl font-bold ${passed ? "text-lcars-radioactive" : "text-destructive"}`}>
            {passed ? "PASS" : "FAIL"}
          </div>
        </div>

        {passed && momentum > 0 && (
          <div className="bg-lcars-alpha-blue/20 border border-lcars-alpha-blue rounded-sm px-5 py-3 text-center">
            <div className="text-lcars-alpha-blue font-display text-3xl font-bold">{momentum}</div>
            <div className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">Momentum</div>
          </div>
        )}

        {totalComplications > 0 && (
          <div className="bg-destructive/20 border border-destructive rounded-sm px-5 py-3 text-center result-pop">
            <div className="text-destructive font-display text-3xl font-bold">{totalComplications}</div>
            <div className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">Comp</div>
          </div>
        )}
      </div>

      {/* Add Momentum button */}
      {canAddMomentum && (
        <button
          onClick={() => onAddMomentum(addableAmount)}
          className="h-10 px-6 bg-lcars-alpha-blue text-primary-foreground rounded-sm font-display text-sm font-bold tracking-wider uppercase hover:brightness-110 transition-all result-pop"
        >
          Add {addableAmount} to Momentum Pool
        </button>
      )}
    </div>
  );
};

export default RollResultPanel;
