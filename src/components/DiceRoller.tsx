import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import RollHistory, { RollHistoryEntry, generateStardate } from "./RollHistory";
import { playRollSound, playCriticalSound, playSuccessSound, playComplicationSound, isMuted, setMuted } from "@/lib/sounds";
import { rollTask, rollAssistDie, type StaRollResult, type StaDieResult } from "@/lib/sta-dice";
import TaskControls from "./TaskControls";
import EconomyPanel from "./EconomyPanel";
import AssistPanel from "./AssistPanel";
import RollResultPanel from "./RollResultPanel";

const DiceRoller = () => {
  // Task parameters
  const [attribute, setAttribute] = useState(8);
  const [department, setDepartment] = useState(2);
  const [focusOn, setFocusOn] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [complicationRange, setComplicationRange] = useState(20);

  // Economy
  const [momentumPool, setMomentumPool] = useState(0);
  const [threatPool, setThreatPool] = useState(0);
  const [extraDice, setExtraDice] = useState(0);

  // Assist
  const [assistEnabled, setAssistEnabled] = useState(false);
  const [assistAttribute, setAssistAttribute] = useState(7);
  const [assistDepartment, setAssistDepartment] = useState(1);

  // Roll state
  const [result, setResult] = useState<StaRollResult | null>(null);
  const [assistDie, setAssistDie] = useState<StaDieResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [rollId, setRollId] = useState(0);
  const [muted, setMutedState] = useState(isMuted());

  const numDice = 2 + extraDice;

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  const rollDice = useCallback(() => {
    setIsRolling(true);
    setResult(null);
    setAssistDie(null);
    playRollSound();

    setTimeout(() => {
      const config = { attribute, department, focusOn, complicationRange, difficulty };
      const rollResult = rollTask(config, numDice);
      let assistResult: StaDieResult | null = null;

      if (assistEnabled) {
        assistResult = rollAssistDie({
          attribute: assistAttribute,
          department: assistDepartment,
          focusOn: false,
          complicationRange,
        });
      }

      setResult(rollResult);
      setAssistDie(assistResult);
      setIsRolling(false);

      // Play outcome sounds
      const allDice = [...rollResult.dice, ...(assistResult ? [assistResult] : [])];
      const hasCritical = allDice.some((d) => d.isCritical);
      const hasComplication = allDice.some((d) => d.isComplication);
      const totalSuccesses = rollResult.totalSuccesses + (assistResult?.successes ?? 0);

      if (hasCritical) {
        playCriticalSound();
      } else if (totalSuccesses > 0) {
        playSuccessSound();
      }
      if (hasComplication) {
        setTimeout(() => playComplicationSound(), hasCritical || totalSuccesses > 0 ? 400 : 0);
      }

      const passed = totalSuccesses >= difficulty;
      const momentum = passed ? Math.max(totalSuccesses - difficulty, 0) : 0;

      setRollId((prev) => prev + 1);
      setHistory((prev) => [
        {
          id: rollId + 1,
          stardate: generateStardate(),
          numDice: numDice + (assistEnabled ? 1 : 0),
          targetNumber: attribute + department,
          totalSuccesses,
          complications: rollResult.complications + (assistResult?.isComplication ? 1 : 0),
          dice: rollResult.dice.map(d => ({
            value: d.value,
            isSuccess: d.successes > 0,
            isCritical: d.isCritical,
            isComplication: d.isComplication,
          })),
          timestamp: new Date(),
          difficulty,
          passed,
          momentum,
          assistDie: assistResult ?? undefined,
        },
        ...prev,
      ].slice(0, 50));
    }, 700);
  }, [attribute, department, focusOn, complicationRange, difficulty, numDice, assistEnabled, assistAttribute, assistDepartment, rollId]);

  const handleAddMomentum = (amount: number) => {
    setMomentumPool((prev) => Math.min(6, prev + amount));
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Task Controls */}
      <TaskControls
        attribute={attribute}
        department={department}
        focusOn={focusOn}
        difficulty={difficulty}
        complicationRange={complicationRange}
        onAttributeChange={setAttribute}
        onDepartmentChange={setDepartment}
        onFocusChange={setFocusOn}
        onDifficultyChange={setDifficulty}
        onComplicationRangeChange={setComplicationRange}
      />

      {/* Economy Panel */}
      <EconomyPanel
        momentumPool={momentumPool}
        threatPool={threatPool}
        extraDice={extraDice}
        onMomentumChange={setMomentumPool}
        onThreatChange={setThreatPool}
        onExtraDiceChange={setExtraDice}
      />

      {/* Assist Panel */}
      <AssistPanel
        enabled={assistEnabled}
        attribute={assistAttribute}
        department={assistDepartment}
        onEnabledChange={setAssistEnabled}
        onAttributeChange={setAssistAttribute}
        onDepartmentChange={setAssistDepartment}
      />

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

      {/* Results */}
      <div className="min-h-[200px] flex flex-col items-center justify-center">
        {result && !isRolling ? (
          <RollResultPanel
            result={result}
            assistDie={assistDie}
            momentumPool={momentumPool}
            onAddMomentum={handleAddMomentum}
            isRolling={isRolling}
            numDice={numDice}
          />
        ) : isRolling ? (
          <RollResultPanel
            result={{ dice: [], totalSuccesses: 0, complications: 0, difficulty, passed: false, momentum: 0 }}
            assistDie={null}
            momentumPool={momentumPool}
            onAddMomentum={handleAddMomentum}
            isRolling={true}
            numDice={numDice}
          />
        ) : (
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
          <div className="text-lcars-alpha-blue text-xs mt-1">
            {focusOn ? `≤ ${attribute} = 2 succ` : "1 = 2 succ"}
          </div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Success</div>
          <div className="text-lcars-radioactive text-xs mt-1">≤ {attribute + department} = 1 succ</div>
        </div>
        <div className="bg-muted rounded-sm py-2 px-3">
          <div className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Complication</div>
          <div className="text-destructive text-xs mt-1">≥ {complicationRange} = comp</div>
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
