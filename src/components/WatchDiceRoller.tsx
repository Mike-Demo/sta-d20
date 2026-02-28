import { useState, useCallback } from "react";
import { rollTask, type StaRollResult } from "@/lib/sta-dice";

const WatchDiceRoller = () => {
  const [attribute, setAttribute] = useState(8);
  const [department, setDepartment] = useState(2);
  const [focusOn, setFocusOn] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [result, setResult] = useState<StaRollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setResult(null);

    setTimeout(() => {
      const rollResult = rollTask({ attribute, department, focusOn, complicationRange: 20, difficulty }, 2);
      setResult(rollResult);
      setIsRolling(false);
    }, 500);
  }, [attribute, department, focusOn, difficulty]);

  return (
    <div className="watch-layout flex flex-col items-center gap-1 p-1 min-h-screen bg-background text-foreground">
      <h1 className="font-display text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
        STA2E-D20
      </h1>

      {/* Controls */}
      <div className="w-full flex flex-col gap-1">
        <StepperRow label="Attr" value={attribute} min={1} max={12} onChange={setAttribute} />
        <StepperRow label="Dept" value={department} min={1} max={12} onChange={setDepartment} />
        <StepperRow label="Diff" value={difficulty} min={0} max={5} onChange={setDifficulty} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase w-10">Focus</span>
          <button
            onClick={() => setFocusOn(!focusOn)}
            className={`h-7 px-3 rounded-sm font-display text-[9px] font-bold tracking-wider uppercase transition-all ${
              focusOn ? "bg-lcars-radioactive text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {focusOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Engage */}
      <button
        onClick={rollDice}
        disabled={isRolling}
        className="w-full h-8 bg-primary text-primary-foreground font-display text-xs font-bold tracking-[0.2em] uppercase rounded-sm active:scale-95 transition-transform disabled:opacity-50"
      >
        {isRolling ? "..." : "ENGAGE"}
      </button>

      {/* Result */}
      {result && !isRolling && (
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <span className="text-lcars-radioactive font-display text-3xl font-bold leading-none">
            {result.totalSuccesses}
          </span>
          <span className={`font-display text-xs font-bold ${result.passed ? "text-lcars-radioactive" : "text-destructive"}`}>
            {result.passed ? "PASS" : "FAIL"}
          </span>
          {result.complications > 0 && (
            <span className="text-destructive text-[9px] font-bold mt-0.5">
              {result.complications} COMP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

function StepperRow({
  label, value, min, max, onChange,
}: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase w-10">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-7 w-7 bg-muted text-foreground rounded-sm font-display text-sm font-bold active:scale-90 transition-transform"
        >−</button>
        <span className="w-6 text-center font-display text-sm font-bold text-primary">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-7 w-7 bg-muted text-foreground rounded-sm font-display text-sm font-bold active:scale-90 transition-transform"
        >+</button>
      </div>
    </div>
  );
}

export default WatchDiceRoller;
