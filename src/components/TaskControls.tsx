interface TaskControlsProps {
  attribute: number;
  department: number;
  focusOn: boolean;
  difficulty: number;
  complicationRange: number;
  onAttributeChange: (v: number) => void;
  onDepartmentChange: (v: number) => void;
  onFocusChange: (v: boolean) => void;
  onDifficultyChange: (v: number) => void;
  onComplicationRangeChange: (v: number) => void;
}

const TaskControls = ({
  attribute, department, focusOn, difficulty, complicationRange,
  onAttributeChange, onDepartmentChange, onFocusChange, onDifficultyChange, onComplicationRangeChange,
}: TaskControlsProps) => {
  const tn = attribute + department;

  return (
    <div className="flex flex-col gap-4">
      {/* Attribute / Department / TN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attribute */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Attribute
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAttributeChange(Math.max(1, attribute - 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >−</button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center">
              <span className="text-primary font-display text-2xl font-bold">{attribute}</span>
            </div>
            <button
              onClick={() => onAttributeChange(Math.min(12, attribute + 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >+</button>
          </div>
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Department
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDepartmentChange(Math.max(1, department - 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >−</button>
            <div className="h-10 w-14 bg-muted rounded-sm flex items-center justify-center">
              <span className="text-primary font-display text-2xl font-bold">{department}</span>
            </div>
            <button
              onClick={() => onDepartmentChange(Math.min(12, department + 1))}
              className="h-10 w-10 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-xl font-bold hover:brightness-125 transition-all"
            >+</button>
          </div>
        </div>

        {/* Target Number (auto) */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Target Number
          </label>
          <div className="h-10 bg-lcars-alpha-blue/20 border border-lcars-alpha-blue rounded-sm flex items-center justify-center">
            <span className="text-lcars-alpha-blue font-display text-2xl font-bold">{tn}</span>
          </div>
          <span className="text-muted-foreground text-[9px] tracking-wider">ATT + DEPT (auto)</span>
        </div>
      </div>

      {/* Focus / Difficulty / Complication Range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Focus toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Focus
          </label>
          <button
            onClick={() => onFocusChange(!focusOn)}
            className={`h-10 rounded-sm font-display text-sm font-bold tracking-widest uppercase transition-all ${
              focusOn
                ? "bg-lcars-radioactive text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {focusOn ? "FOCUSED" : "OFF"}
          </button>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Difficulty
          </label>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onDifficultyChange(n)}
                className={`h-10 w-9 rounded-sm font-display text-lg font-bold transition-all ${
                  difficulty === n
                    ? "bg-lcars-alpha-blue text-primary-foreground scale-110"
                    : "bg-muted text-muted-foreground hover:bg-lcars-beta-blue hover:text-primary-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Complication Range */}
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Comp Range
          </label>
          <div className="flex items-center gap-1">
            {[20, 19, 18, 17].map((r) => (
              <button
                key={r}
                onClick={() => onComplicationRangeChange(r)}
                className={`h-10 flex-1 rounded-sm font-display text-xs font-bold transition-all ${
                  complicationRange === r
                    ? "bg-destructive text-destructive-foreground scale-105"
                    : "bg-muted text-muted-foreground hover:bg-destructive/50"
                }`}
              >
                {r === 20 ? "20" : `${r}–20`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskControls;
