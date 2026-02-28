import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DieResult {
  value: number;
  isSuccess: boolean;
  isCritical: boolean;
  isComplication: boolean;
}

interface ExplainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dice: DieResult[];
  targetNumber: number;
  totalSuccesses: number;
  complications: number;
  difficulty: number;
  focusOn: boolean;
  complicationRange: number;
  momentumBuy: number;
  threatBuy: number;
}

const ExplainModal = ({
  open,
  onOpenChange,
  dice,
  targetNumber,
  totalSuccesses,
  complications,
  difficulty,
  focusOn,
  complicationRange,
  momentumBuy,
  threatBuy,
}: ExplainModalProps) => {
  const bonusSuccesses = momentumBuy + threatBuy;
  const effectiveSuccesses = totalSuccesses + bonusSuccesses;
  const passed = effectiveSuccesses >= difficulty;
  const momentum = effectiveSuccesses - difficulty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lcars-arctic-ice font-display text-sm font-bold tracking-[0.2em] uppercase">
            Result Breakdown
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detailed explanation of each die result
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 text-sm">
          {dice.map((die, i) => {
            let label: string;
            let successCount = 0;
            if (die.isComplication) {
              label = `Complication (${die.value} ≥ ${complicationRange})`;
            } else if (die.isCritical) {
              label = "Critical Success (natural 1, +2)";
              successCount = 2;
            } else if (die.isSuccess && focusOn) {
              label = `Focus Success (${die.value} ≤ TN ${targetNumber}, +2)`;
              successCount = 2;
            } else if (die.isSuccess) {
              label = `Success (${die.value} ≤ TN ${targetNumber}, +1)`;
              successCount = 1;
            } else {
              label = `Miss (${die.value} > TN ${targetNumber})`;
            }

            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-muted-foreground font-display text-xs w-12">
                  Die {i + 1}:
                </span>
                <span
                  className={`font-display font-bold w-6 text-center ${
                    die.isComplication
                      ? "text-destructive"
                      : die.isCritical
                      ? "text-lcars-gold"
                      : die.isSuccess
                      ? "text-lcars-radioactive"
                      : "text-muted-foreground"
                  }`}
                >
                  {die.value}
                </span>
                <span className="text-muted-foreground text-xs">— {label}</span>
              </div>
            );
          })}

          <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1 text-xs">
            <div className="text-foreground">
              Dice successes: <span className="text-lcars-radioactive font-bold">{totalSuccesses}</span>
            </div>
            {bonusSuccesses > 0 && (
              <div className="text-foreground">
                Bonus (Momentum {momentumBuy} + Threat {threatBuy}):{" "}
                <span className="text-lcars-arctic-ice font-bold">+{bonusSuccesses}</span>
              </div>
            )}
            <div className="text-foreground">
              vs Difficulty: <span className="text-lcars-arctic-ice font-bold">{difficulty}</span>
            </div>
            <div className={`font-display font-bold text-sm mt-1 ${passed ? "text-lcars-radioactive" : "text-destructive"}`}>
              {passed
                ? `SUCCESS — Momentum +${momentum}`
                : `FAILURE — Short by ${Math.abs(momentum)}`}
            </div>
            {complications > 0 && (
              <div className="text-destructive font-bold">
                + {complications} Complication{complications !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="mt-2 h-8 px-6 bg-lcars-beta-blue text-primary-foreground font-display text-xs font-bold tracking-[0.2em] uppercase lcars-pill hover:brightness-110 transition-all self-center"
        >
          DISMISS
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ExplainModal;
