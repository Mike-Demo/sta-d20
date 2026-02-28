import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface AssistPanelProps {
  enabled: boolean;
  attribute: number;
  department: number;
  onEnabledChange: (v: boolean) => void;
  onAttributeChange: (v: number) => void;
  onDepartmentChange: (v: number) => void;
}

const AssistPanel = ({
  enabled, attribute, department,
  onEnabledChange, onAttributeChange, onDepartmentChange,
}: AssistPanelProps) => {
  return (
    <Collapsible open={enabled} onOpenChange={onEnabledChange}>
      <CollapsibleTrigger className="w-full flex items-center justify-between bg-muted/50 border border-border rounded-sm px-3 py-2 hover:bg-muted transition-colors">
        <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Assist {enabled ? "ON" : "OFF"}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${enabled ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Assist Attribute */}
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Assist Attr</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAttributeChange(Math.max(1, attribute - 1))}
                className="h-9 w-9 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
              >−</button>
              <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center">
                <span className="text-primary font-display text-xl font-bold">{attribute}</span>
              </div>
              <button
                onClick={() => onAttributeChange(Math.min(12, attribute + 1))}
                className="h-9 w-9 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
              >+</button>
            </div>
          </div>

          {/* Assist Department */}
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Assist Dept</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDepartmentChange(Math.max(1, department - 1))}
                className="h-9 w-9 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
              >−</button>
              <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center">
                <span className="text-primary font-display text-xl font-bold">{department}</span>
              </div>
              <button
                onClick={() => onDepartmentChange(Math.min(12, department + 1))}
                className="h-9 w-9 bg-lcars-arctic-ice text-accent-foreground rounded-sm font-display text-lg font-bold hover:brightness-125 transition-all"
              >+</button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AssistPanel;
