import { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

interface LCARSFrameProps {
  title: string;
  children: ReactNode;
}

const LCARSFrame = ({ title, children }: LCARSFrameProps) => {
  return (
    <div className="min-h-screen bg-background p-3 md:p-6 flex flex-col">
      {/* Top bar */}
      <div className="flex items-stretch gap-2 mb-2">
        <div className="bg-lcars-mauve lcars-pill-left h-12 w-32 md:w-48 flex-shrink-0" />
        <div className="bg-lcars-blue h-12 flex-1" />
        <div className="bg-lcars-gold h-12 w-20 md:w-32 flex items-center justify-center">
          <span className="text-primary-foreground font-display text-xs md:text-sm font-bold tracking-widest uppercase">
            LCARS
          </span>
        </div>
        <div className="bg-lcars-amber lcars-pill-right h-12 w-16 md:w-24 flex-shrink-0" />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2">
        {/* Left sidebar */}
        <div className="hidden md:flex flex-col gap-2 w-32 lg:w-48 flex-shrink-0">
          <div className="bg-lcars-gold lcars-elbow-tl h-20 flex items-end p-2">
            <span className="text-primary-foreground text-[10px] font-bold tracking-wider">01-4774</span>
          </div>
          <div className="bg-lcars-amber h-10" />
          <div className="bg-lcars-peach h-6" />
          <div className="bg-lcars-blue h-14" />
          <div className="bg-lcars-mauve h-8" />
          <div className="bg-lcars-lavender h-6" />
          <div className="bg-lcars-teal h-10" />
          <div className="bg-lcars-gold flex-1" />
          <div className="bg-lcars-amber h-8" />
          <div className="bg-lcars-mauve lcars-elbow-bl h-16 flex items-start p-2">
            <span className="text-accent-foreground text-[10px] font-bold tracking-wider">47-0198</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title bar */}
          <div className="flex items-center gap-2">
            <div className="bg-lcars-gold h-8 w-4 md:hidden rounded-l-full" />
            <div className="bg-muted h-8 flex-1 flex items-center px-4">
              <h1 className="text-primary font-display text-lg md:text-2xl font-bold tracking-[0.2em] uppercase">
                {title}
              </h1>
            </div>
            <div className="bg-lcars-blue h-8 w-16 lcars-pill-right" />
          </div>

          {/* Main area */}
          <main className="flex-1 bg-card/50 border border-border rounded-sm p-4 md:p-6 overflow-auto">
            {children}
          </main>

          {/* External links */}
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.startrek.com/category/games"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-blue hover:bg-lcars-teal transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              <ExternalLink className="w-3 h-3" />
              Star Trek Games
            </a>
            <a
              href="https://sta.bcholmes.org/index.html"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-mauve hover:bg-lcars-lavender transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              <ExternalLink className="w-3 h-3" />
              STA Reference
            </a>
            <a
              href="https://gaymingfoundation.org/donate/"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-peach hover:bg-lcars-gold transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              🏳️‍🌈 Gayming Foundation
            </a>
            <a
              href="https://www.zeffy.com/en-US/donation-form/ggp-gay-gaming-professionals"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-teal hover:bg-lcars-blue transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              🏳️‍⚧️ Gay Gaming Professionals
            </a>
          </div>

          {/* Bottom bar */}
          <div className="flex items-stretch gap-2">
            <div className="bg-lcars-teal h-6 w-12 md:w-20 lcars-pill-left" />
            <div className="bg-lcars-peach h-6 flex-1" />
            <div className="bg-lcars-lavender h-6 w-24 flex items-center justify-center">
              <span className="text-accent-foreground text-[9px] font-bold tracking-widest">STARDATE 2402.7</span>
            </div>
            <div className="bg-lcars-gold h-6 w-12 md:w-20 lcars-pill-right" />
          </div>

          {/* Disclaimer */}
          <footer className="mt-2 px-2 text-center space-y-1">
            <p className="text-muted-foreground text-[9px] leading-tight">
              This is a community-created tool for Star Trek Adventures, and has no official affiliation with Modiphius.
            </p>
            <p className="text-muted-foreground text-[8px] leading-tight">
              TM &amp; © 2026 CBS Studios Inc. STAR TREK and related marks and logos are trademarks of CBS Studios Inc. All Rights Reserved.
            </p>
            <p className="text-muted-foreground text-[8px] leading-tight">
              Some elements of this interface were replicated with AI assistance. Safety protocols remain engaged.
            </p>
            <p className="text-muted-foreground text-[8px] leading-tight">
              <a href="https://www.flaticon.com/free-icons/enterprise" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" title="enterprise icons" className="underline hover:text-primary transition-colors">Enterprise icons created by pocike - Flaticon</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LCARSFrame;
