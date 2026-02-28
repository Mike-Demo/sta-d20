import { useState, useCallback } from "react";

interface DieResult {
  value: number;
  isSuccess: boolean;
  isCritical: boolean;
  isComplication: boolean;
}

const WatchDiceRoller = () => {
  const [numDice, setNumDice] = useState(2);
  const [targetNumber, setTargetNumber] = useState(10);
  
  const [totalSuccesses, setTotalSuccesses] = useState<number | null>(null);
  const [complications, setComplications] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setTotalSuccesses(null);

    setTimeout(() => {
      const dice: DieResult[] = [];
      for (let i = 0; i < numDice; i++) {
        const value = Math.floor(Math.random() * 20) + 1;
        dice.push({
          value,
          isSuccess: value <= targetNumber,
          isCritical: value === 1,
          isComplication: value === 20,
        });
      }

      const successes = dice.reduce((sum, d) => {
        if (d.isCritical) return sum + 2;
        if (d.isSuccess) return sum + 1;
        return sum;
      }, 0);

      setTotalSuccesses(successes);
      setComplications(dice.filter((d) => d.isComplication).length);
      setIsRolling(false);
    }, 500);
  }, [numDice, targetNumber]);

  return (
    <div className="watch-layout flex flex-col items-center gap-1 p-1 min-h-screen bg-background text-foreground">
      <h1 className="font-display text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
        STA2E-D20
      </h1>

      {/* Controls */}
      <div className="w-full flex flex-col gap-1">
        <StepperRow label="Dice" value={numDice} min={1} max={5} onChange={setNumDice} />
        <StepperRow label="TN" value={targetNumber} min={1} max={20} onChange={setTargetNumber} />
        
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
      {totalSuccesses !== null && !isRolling && (
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <span className="text-lcars-radioactive font-display text-3xl font-bold leading-none">
            {totalSuccesses}
          </span>
          <span className="text-muted-foreground text-[8px] font-bold tracking-widest uppercase">
            Successes
          </span>
          {complications > 0 && (
            <span className="text-destructive text-[9px] font-bold mt-0.5">
              {complications} COMP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

function StepperRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase w-10">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-7 w-7 bg-muted text-foreground rounded-sm font-display text-sm font-bold active:scale-90 transition-transform"
        >
          −
        </button>
        <span className="w-6 text-center font-display text-sm font-bold text-primary">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-7 w-7 bg-muted text-foreground rounded-sm font-display text-sm font-bold active:scale-90 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default WatchDiceRoller;
