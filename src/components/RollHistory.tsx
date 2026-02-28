import { ScrollArea } from "@/components/ui/scroll-area";

export interface RollHistoryEntry {
  id: number;
  stardate: string;
  numDice: number;
  targetNumber: number;
  
  totalSuccesses: number;
  complications: number;
  dice: { value: number; isSuccess: boolean; isCritical: boolean; isComplication: boolean }[];
  timestamp: Date;
}

function generateStardate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const fraction = Math.floor((now.getHours() * 60 + now.getMinutes()) / 1.44);
  return `${year - 624}.${dayOfYear.toString().padStart(3, "0")}.${fraction.toString().padStart(3, "0")}`;
}

interface RollHistoryProps {
  entries: RollHistoryEntry[];
}

const RollHistory = ({ entries }: RollHistoryProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground font-display text-sm tracking-wider uppercase">
          No entries in ship's log
        </p>
        <p className="text-muted-foreground text-xs mt-1 tracking-wide">
          Roll dice to begin recording
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[280px]">
      <div className="flex flex-col gap-2 pr-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-muted/50 border border-border rounded-sm p-3 result-pop"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lcars-arctic-ice font-display text-xs font-bold tracking-widest">
                SD {entry.stardate}
              </span>
              <span className="text-muted-foreground text-[9px] tracking-wider uppercase">
                {entry.numDice}d20 · TN {entry.targetNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              {entry.dice.map((die, i) => (
                <span
                  key={i}
                  className={`font-display text-sm font-bold px-1.5 py-0.5 rounded-sm ${
                    die.isComplication
                      ? "bg-destructive/20 text-destructive"
                      : die.isCritical
                      ? "bg-lcars-alpha-blue/20 text-lcars-alpha-blue"
                      : die.isSuccess
                      ? "bg-lcars-radioactive/20 text-lcars-radioactive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {die.value}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-lcars-radioactive font-bold">
                {entry.totalSuccesses} success{entry.totalSuccesses !== 1 ? "es" : ""}
              </span>
              {entry.complications > 0 && (
                <span className="text-destructive font-bold">
                  {entry.complications} complication{entry.complications !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export { generateStardate };
export default RollHistory;
