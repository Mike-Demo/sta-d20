import { nextDieCost } from "@/lib/sta-dice";

interface EconomyPanelProps {
  momentumPool: number;
  threatPool: number;
  extraDice: number;
  onMomentumChange: (v: number) => void;
  onThreatChange: (v: number) => void;
  onExtraDiceChange: (v: number) => void;
}

const MAX_MOMENTUM = 6;
const MAX_EXTRA = 3; // base 2 + 3 = 5

const EconomyPanel = ({
  momentumPool, threatPool, extraDice,
  onMomentumChange, onThreatChange, onExtraDiceChange,
}: EconomyPanelProps) => {
  const cost = nextDieCost(extraDice);
  const canBuyMore = extraDice < MAX_EXTRA;
  const canBuyWithMomentum = canBuyMore && momentumPool >= cost;
  const canBuyWithThreat = canBuyMore;

  const buyWithMomentum = () => {
    if (!canBuyWithMomentum) return;
    onMomentumChange(momentumPool - cost);
    onExtraDiceChange(extraDice + 1);
  };

  const buyWithThreat = () => {
    if (!canBuyWithThreat) return;
    onThreatChange(threatPool + cost);
    onExtraDiceChange(extraDice + 1);
  };

  const resetExtra = () => onExtraDiceChange(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Momentum & Threat counters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Momentum */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">Momentum</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMomentumChange(Math.max(0, momentumPool - 1))}
              className="h-9 w-9 bg-lcars-radioactive text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
            >−</button>
            <div className="h-9 w-12 bg-lcars-radioactive/20 border border-lcars-radioactive rounded-sm flex items-center justify-center">
              <span className="text-lcars-radioactive font-display text-xl font-bold">{momentumPool}</span>
            </div>
            <button
              onClick={() => onMomentumChange(Math.min(MAX_MOMENTUM, momentumPool + 1))}
              className="h-9 w-9 bg-lcars-radioactive text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
            >+</button>
          </div>
        </div>

        {/* Threat */}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">Threat</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onThreatChange(Math.max(0, threatPool - 1))}
              className="h-9 w-9 bg-destructive text-destructive-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
            >−</button>
            <div className="h-9 w-12 bg-destructive/20 border border-destructive rounded-sm flex items-center justify-center">
              <span className="text-destructive font-display text-xl font-bold">{threatPool}</span>
            </div>
            <button
              onClick={() => onThreatChange(threatPool + 1)}
              className="h-9 w-9 bg-destructive text-destructive-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
            >+</button>
          </div>
        </div>
      </div>

      {/* Buy Extra Dice */}
      <div className="bg-muted/50 border border-border rounded-sm p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Dice Pool: 2 + {extraDice} = {2 + extraDice}
          </span>
          {extraDice > 0 && (
            <button
              onClick={resetExtra}
              className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase hover:text-destructive transition-colors"
            >RESET</button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={buyWithMomentum}
            disabled={!canBuyWithMomentum}
            className="flex-1 h-9 bg-lcars-radioactive/80 text-accent-foreground rounded-sm font-display text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +Die (Mom: {cost})
          </button>
          <button
            onClick={buyWithThreat}
            disabled={!canBuyWithThreat}
            className="flex-1 h-9 bg-destructive/80 text-destructive-foreground rounded-sm font-display text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +Die (Threat: +{cost})
          </button>
        </div>
      </div>
    </div>
  );
};

export default EconomyPanel;
