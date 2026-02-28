import { Leaf } from "lucide-react";

const CarbonBadge = () => {
  return (
    <a
      href="https://www.websitecarbon.com/website/2d20-space/"
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      className="inline-flex items-center gap-1.5 bg-muted hover:bg-lcars-night-cloud transition-colors rounded-sm px-2 py-0.5 group"
      title="Website Carbon Calculator — view full report"
    >
      <Leaf className="w-2.5 h-2.5 text-lcars-radioactive flex-shrink-0" />
      <span className="text-lcars-radioactive font-lcars text-[8px] tracking-wider font-bold uppercase">
        0.02g CO₂
      </span>
      <span className="text-muted-foreground font-lcars text-[8px] tracking-wider">
        — Cleaner than 98% of sites
      </span>
    </a>
  );
};

export default CarbonBadge;
