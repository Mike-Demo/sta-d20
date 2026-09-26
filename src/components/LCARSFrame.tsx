import { ReactNode } from "react";
import { Link } from "@/lib/router-compat";
import { ExternalLink, ChevronDown } from "lucide-react";
import wtfplLogo from "@/assets/wtfpl.svg";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import LCARSInfoAccordion from "@/components/LCARSInfoAccordion";

interface LCARSFrameProps {
  title: string;
  children: ReactNode;
}

const LCARSFrame = ({ title, children }: LCARSFrameProps) => {
  return (
    <div className="min-h-screen bg-background p-3 md:p-6 flex flex-col" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))", paddingLeft: "max(0.75rem, env(safe-area-inset-left))", paddingRight: "max(0.75rem, env(safe-area-inset-right))", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      {/* Top bar */}
      <div className="flex items-stretch gap-2 mb-2">
        <div className="bg-lcars-arctic-ice lcars-pill-left h-12 w-32 md:w-48 flex-shrink-0" aria-hidden="true" />
        <div className="bg-lcars-alpha-blue h-12 flex-1" aria-hidden="true" />
        <div className="bg-lcars-beta-blue h-12 w-20 md:w-32 flex items-center justify-center" aria-hidden="true">
          <span className="text-primary-foreground font-display text-xs md:text-sm font-bold tracking-widest uppercase">
            LCARS
          </span>
        </div>
        <ThemeSwitcher />
        <div className="bg-lcars-night-rain lcars-pill-right h-12 w-16 md:w-24 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2">
        {/* Left sidebar */}
        <div className="hidden md:flex flex-col gap-2 w-32 lg:w-48 flex-shrink-0" aria-hidden="true">
          <div className="bg-lcars-alpha-blue lcars-elbow-tl h-20 flex items-end p-2">
            <span className="text-primary-foreground text-[10px] font-bold tracking-wider">01-4774</span>
          </div>
          <div className="bg-lcars-beta-blue h-10" />
          <div className="bg-lcars-arctic-snow h-6" />
          <div className="bg-lcars-arctic-ice h-14" />
          <div className="bg-lcars-night-rain h-8" />
          <div className="bg-lcars-arctic-snow h-6" />
          <div className="bg-lcars-radioactive h-10" />
          <div className="bg-lcars-alpha-blue flex-1" />
          <div className="bg-lcars-beta-blue h-8" />
          <div className="bg-lcars-night-cloud lcars-elbow-bl h-16 flex items-start p-2">
            <span className="text-foreground text-[10px] font-bold tracking-wider">47-0198</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title bar */}
          <div className="flex items-center gap-2">
            <div className="bg-lcars-alpha-blue h-8 w-4 md:hidden rounded-l-full" />
            <div className="bg-muted h-8 flex-1 flex items-center px-4">
              <h1 className="text-primary font-display text-lg md:text-2xl font-bold tracking-[0.2em] uppercase">
                <span className="md:hidden">{title}</span>
                <span className="hidden md:inline">Star Trek Adventures 2d20 Dice Roller</span>
              </h1>
            </div>
            <div className="bg-lcars-arctic-ice h-8 w-16 lcars-pill-right" />
          </div>

          {/* Info accordion */}
          <LCARSInfoAccordion />

          {/* Main area */}
          <main className="flex-1 bg-card/50 border border-border rounded-sm p-4 md:p-6 overflow-auto" aria-label="LCARS-style panel showing d20 roll results">
            {children}
          </main>

          {/* External links */}
          <div className="flex flex-wrap gap-2">
            <Link
              to="/guide/probability"
              className="bg-lcars-gold hover:bg-lcars-radioactive transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-accent-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              2d20 Probability &amp; Momentum Guide
            </Link>
            <a
              href="https://www.startrek.com/category/games"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-alpha-blue hover:bg-lcars-radioactive transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              Star Trek Games
            </a>
            <a
              href="https://sta.bcholmes.org/index.html"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-arctic-ice hover:bg-lcars-arctic-snow transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-accent-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              STA Reference
            </a>
            <a
              href="https://gaymingfoundation.org/donate/"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-beta-blue hover:bg-lcars-alpha-blue transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-primary-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              🏳️‍🌈 Gayming Foundation
            </a>
            <a
              href="https://www.zeffy.com/en-US/donation-form/ggp-gay-gaming-professionals"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="bg-lcars-radioactive hover:bg-lcars-arctic-ice transition-colors h-8 lcars-pill-right flex items-center gap-2 px-4 text-accent-foreground text-[11px] font-bold tracking-wider uppercase"
            >
              🏳️‍⚧️ Gay Gaming Professionals
            </a>
          </div>

          {/* Credits footer */}
          <footer className="mt-2">
            <details
              className="rounded-sm border border-border bg-background overflow-hidden"
              aria-label="Credits, licensing, and attribution"
            >
              <summary
                className="bg-lcars-alpha-blue text-primary-foreground hover:bg-lcars-radioactive hover:text-accent-foreground font-display text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 cursor-pointer list-none lcars-pill-right transition-colors select-none [&::-webkit-details-marker]:hidden flex items-center gap-2"
              >
                <ChevronDown className="w-3 h-3 transition-transform duration-200 [[open]>&]:rotate-180" aria-hidden="true" />
                Credits &amp; Licensing
              </summary>
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-[8px] leading-relaxed">
                  TM &amp; © 2026 CBS Studios Inc. STAR TREK and related marks and logos are trademarks of CBS Studios Inc. All rights reserved. This site is a community-created tool for the Star Trek Adventures tabletop role-playing game and is not affiliated with or endorsed by Modiphius Entertainment. Some interface elements were created or refined with AI assistance. No trackers were detected on 2d20.space, and the site holds a 90/100 privacy score according to <a href="https://geckoadvisor.com/privacy-report/2d20.space" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">GeckoAdvisor</a>. Estimated emissions are 0.01g CO₂ per visit, cleaner than 98% of tested sites, as measured by <a href="https://www.websitecarbon.com/website/2d20-space/" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">Website Carbon</a>. The LCARS-inspired interface draws on design principles popularized by <a href="https://thelcars.com/" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">thelcars.com</a> by Jim Robertus, and the <a href="https://icons8.com/icon/21039/star-trek" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">Star Trek</a> icon is provided by <a href="https://icons8.com/" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">Icons8</a>. Open-source code: <a href="https://github.com/nastyox/Rando.js" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="underline hover:text-primary transition-colors">Web Crypto API</a> for cryptographically secure dice rolls. Technical files available: <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">robots.txt</a>, <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">llms.txt</a>, <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">sitemap.xml</a>. Open-source credits: <Link to="/licenses" className="underline hover:text-primary transition-colors">licenses</Link>.
                </p>
              </div>
            </details>
          </footer>

          {/* Bottom bar */}
          <div className="flex items-stretch gap-2">
            <div className="bg-lcars-radioactive h-6 w-12 md:w-20 lcars-pill-left" aria-hidden="true" />
            <div className="bg-lcars-arctic-snow h-6 flex-1" aria-hidden="true" />
            <div className="bg-lcars-night-rain h-6 w-24 flex items-center justify-center" aria-hidden="true">
              <span className="text-primary-foreground text-[9px] font-bold tracking-widest">STARDATE 2402.7</span>
            </div>
            <a href="/license.txt" target="_blank" rel="noopener noreferrer" className="bg-lcars-night-rain h-6 flex items-center justify-center px-2 hover:opacity-80 transition-opacity" title="WTFPL v2 License">
              <img src={wtfplLogo} alt="WTFPL License" loading="lazy" className="h-4 w-auto invert opacity-70" />
            </a>
            <div className="bg-lcars-alpha-blue h-6 w-12 md:w-20 lcars-pill-right" aria-hidden="true" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LCARSFrame;
