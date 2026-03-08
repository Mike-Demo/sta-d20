import { ChevronDown } from "lucide-react";

const sections = [
  {
    id: "instructions",
    label: "Instructions",
    color: "bg-lcars-night-rain",
    hoverColor: "hover:bg-lcars-arctic-snow hover:text-accent-foreground",
    textColor: "text-primary-foreground",
    ariaLabel: "How to use the dice roller",
  },
  {
    id: "details",
    label: "Details",
    color: "bg-lcars-beta-blue",
    hoverColor: "hover:bg-lcars-alpha-blue",
    textColor: "text-primary-foreground",
    ariaLabel: "Rules and features supported",
  },
] as const;

const LCARSInfoAccordion = () => {
  return (
    <div className="flex flex-col gap-1">
      {/* Section 1: Instructions */}
      <details
        className="rounded-sm border border-border bg-background overflow-hidden"
        aria-label={sections[0].ariaLabel}
      >
        <summary
          className={`${sections[0].color} ${sections[0].textColor} ${sections[0].hoverColor} font-display text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 cursor-pointer list-none lcars-pill-right transition-colors select-none [&::-webkit-details-marker]:hidden flex items-center gap-2`}
        >
          <ChevronDown className="w-3 h-3 transition-transform duration-200 [[open]>&]:rotate-180" aria-hidden="true" />
          {sections[0].label}
        </summary>
        <div className="px-4 py-3 text-muted-foreground text-xs leading-relaxed space-y-2">
          <p>Welcome, Ensign! This tool helps you roll Star Trek Adventures Second Edition dice without accidentally triggering a warp core breach. Just follow these steps and you'll be generating 2d20 results faster than Boimler spiraling into an anxiety loop.</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Enter your Target Number and Focus (or pretend you remembered them).</li>
            <li>Select how many d20s you want to roll — responsibly or chaotically.</li>
            <li>Enable Assist or Ship rolls if your crew isn't busy causing shenanigans.</li>
            <li>Adjust Complication Range, Momentum, and Threat like a real Starfleet officer.</li>
            <li>Tap "Roll" and watch the results appear like a red alert you definitely didn't cause.</li>
          </ul>
          <p>It's fast, it's LCARS‑y, and it won't yell at you like Shaxs. Probably.</p>
        </div>
      </details>

      {/* Section 2: Details */}
      <details
        className="rounded-sm border border-border bg-background overflow-hidden"
        aria-label={sections[1].ariaLabel}
      >
        <summary
          className={`${sections[1].color} ${sections[1].textColor} ${sections[1].hoverColor} font-display text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 cursor-pointer list-none lcars-pill-right transition-colors select-none [&::-webkit-details-marker]:hidden flex items-center gap-2`}
        >
          <ChevronDown className="w-3 h-3 transition-transform duration-200 [[open]>&]:rotate-180" aria-hidden="true" />
          {sections[1].label}
        </summary>
        <div className="px-4 py-3 text-muted-foreground text-xs leading-relaxed space-y-2">
          <p>This roller follows the official Star Trek Adventures Second Edition 2d20 ruleset — no mirror universe math, no temporal paradoxes, just clean Federation‑approved calculations.</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Difficulty ratings and Complication Range</li>
            <li>Assist rolls and Ship rolls (assuming the ship isn't exploding)</li>
            <li>Momentum and Threat buys</li>
            <li>Automatic success counting</li>
            <li>Complication detection (sorry in advance)</li>
          </ul>
          <p>Everything runs client‑side, which means your rolls stay private — even from suspicious admirals.</p>
        </div>
      </details>
    </div>
  );
};

export default LCARSInfoAccordion;
