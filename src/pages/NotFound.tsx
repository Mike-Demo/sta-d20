import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const [compensatorDots, setCompensatorDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCompensatorDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-3 md:p-6 flex flex-col" role="main" aria-label="404 Error Page">
      {/* Top bar */}
      <div className="flex items-stretch gap-2 mb-2">
        <div className="bg-lcars-arctic-ice lcars-pill-left h-12 w-32 md:w-48 flex-shrink-0" />
        <div className="bg-lcars-alpha-blue h-12 flex-1" />
        <div className="bg-lcars-beta-blue h-12 w-20 md:w-32 flex items-center justify-center">
          <span className="text-primary-foreground font-display text-xs md:text-sm font-bold tracking-widest uppercase">
            LCARS
          </span>
        </div>
        <div className="bg-lcars-night-rain lcars-pill-right h-12 w-16 md:w-24 flex-shrink-0" />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-2">
        {/* Left sidebar — 404 OPS PANEL */}
        <div className="hidden md:flex flex-col gap-2 w-32 lg:w-48 flex-shrink-0" aria-label="404 OPS PANEL">
          <div className="bg-lcars-alpha-blue lcars-elbow-tl h-20 flex items-end p-2">
            <span className="text-primary-foreground text-[10px] font-bold tracking-wider">404 OPS</span>
          </div>
          <div className="bg-lcars-beta-blue h-10 flex items-center justify-center">
            <span className="text-primary-foreground text-[9px] font-bold tracking-wider">PANEL</span>
          </div>
          {/* Pulsing alert bars */}
          <div
            className="bg-lcars-sunset-red h-6"
            style={{ animation: "lcars-alert-pulse 1.2s ease-in-out infinite" }}
          />
          <div className="bg-lcars-arctic-snow h-6" />
          <div
            className="bg-lcars-sunset-red h-6"
            style={{ animation: "lcars-alert-pulse 1.2s ease-in-out infinite 0.4s" }}
          />
          <div className="bg-lcars-arctic-ice h-14" />
          <div
            className="bg-lcars-sunset-red h-6"
            style={{ animation: "lcars-alert-pulse 1.2s ease-in-out infinite 0.8s" }}
          />
          <div className="bg-lcars-night-rain h-8" />
          <div className="bg-lcars-radioactive h-10 flex items-center justify-center">
            <span className="text-accent-foreground text-[8px] font-bold tracking-wider">ALERT</span>
          </div>
          <div className="bg-lcars-alpha-blue flex-1" />
          <div className="bg-lcars-beta-blue h-8" />
          <div className="bg-lcars-night-cloud lcars-elbow-bl h-16 flex items-start p-2">
            <span className="text-foreground text-[10px] font-bold tracking-wider">47-0404</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title bar */}
          <div className="flex items-center gap-2">
            <div className="bg-lcars-alpha-blue h-8 w-4 md:hidden rounded-l-full" />
            <div className="bg-muted h-8 flex-1 flex items-center px-4">
              <h1 className="text-primary font-display text-xs sm:text-sm md:text-lg font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase">
                TEMPORAL ANOMALY DETECTED
              </h1>
            </div>
            <div className="bg-lcars-arctic-ice h-8 w-16 lcars-pill-right" />
          </div>

          {/* Main area */}
          <div className="flex-1 bg-card/50 border border-border rounded-sm p-4 md:p-6 overflow-auto space-y-6">

            {/* 1. LCARS headline block */}
            <div className="bg-lcars-alpha-blue/20 border border-lcars-alpha-blue rounded-sm p-4 md:p-6">
              <h2
                className="text-lcars-arctic-ice font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wider uppercase leading-tight"
                role="heading"
                aria-level={2}
              >
                404 — UNAUTHORIZED TEMPORAL MISADVENTURE DETECTED
              </h2>
            </div>

            {/* 2. Sub-header */}
            <div className="bg-muted px-4 py-2 rounded-sm">
              <p className="text-lcars-arctic-snow font-lcars text-sm md:text-base tracking-wide">
                This page does not exist in this timeline. (DTI has been notified.)
              </p>
            </div>

            {/* 3. In-universe flavor text */}
            <div className="border-l-4 border-lcars-radioactive bg-card/80 p-4 rounded-sm space-y-3">
              <blockquote className="text-lcars-radioactive font-lcars text-base md:text-lg italic">
                "Ensign! You've routed the EPS conduits into a nonexistent deck again!"
              </blockquote>
              <p className="text-muted-foreground font-lcars text-xs tracking-wider uppercase">
                — Probably someone on the Cerritos
              </p>
              <p className="text-foreground font-lcars text-sm leading-relaxed mt-3">
                A junior officer attempted to access a file Starfleet has classified as{" "}
                <span className="text-lcars-arctic-ice">"Oops, that's not real,"</span>{" "}
                triggering a Level‑0.5 Diagnostic. The requested path{" "}
                <code className="text-lcars-radioactive bg-muted px-1.5 py-0.5 rounded text-xs">
                  {location.pathname}
                </code>{" "}
                could not be located in any known database.
              </p>
            </div>

            {/* 4. LCARS diagnostic readout panel */}
            <div className="border border-lcars-beta-blue rounded-sm overflow-hidden">
              <div className="bg-lcars-beta-blue px-4 py-2 flex items-center gap-2">
                <span className="text-primary-foreground font-display text-xs font-bold tracking-widest uppercase">
                  DIAGNOSTIC READOUT
                </span>
                <div
                  className="w-2 h-2 rounded-full bg-lcars-radioactive ml-auto"
                  style={{ animation: "lcars-alert-pulse 1s ease-in-out infinite" }}
                  aria-hidden="true"
                />
              </div>
              <div className="bg-card/60 p-4 space-y-2 font-lcars text-sm">
                {[
                  ["Error Code", "404‑GNDN"],
                  ["Subsystem", "File Retrieval / Deck 17"],
                  ["Cause", "Misaligned isolinear chip or enthusiastic button‑mashing"],
                  ["Status", "Containment field stable"],
                  ["Recommendation", "Stop touching things"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-lcars-arctic-snow font-bold tracking-wider uppercase text-xs w-40 flex-shrink-0">
                      {label}:
                    </span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heisenberg compensator indicator */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-sm">
              <div
                className="w-2 h-2 rounded-full bg-lcars-gold flex-shrink-0"
                style={{ animation: "lcars-alert-pulse 1.5s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <span className="text-lcars-gold font-lcars text-xs tracking-wider">
                Recalibrating Heisenberg compensators{compensatorDots}
              </span>
            </div>

            {/* 5. Return button */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <a
                href="/"
                className="bg-lcars-alpha-blue hover:bg-lcars-radioactive transition-colors lcars-pill px-8 py-4 text-primary-foreground font-display text-sm md:text-base font-bold tracking-[0.2em] uppercase text-center"
                aria-label="Return to main console"
              >
                RETURN TO MAIN CONSOLE
              </a>
              <p className="text-muted-foreground font-lcars text-[10px] tracking-wider italic">
                Seriously, Ensign. Before something actually explodes.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-stretch gap-2">
            <div className="bg-lcars-sunset-red h-6 w-12 md:w-20 lcars-pill-left" />
            <div className="bg-lcars-arctic-snow h-6 flex-1" />
            <div className="bg-lcars-night-rain h-6 w-24 flex items-center justify-center">
              <span className="text-primary-foreground text-[9px] font-bold tracking-widest">ERROR 404</span>
            </div>
            <div className="bg-lcars-alpha-blue h-6 w-12 md:w-20 lcars-pill-right" />
          </div>
        </div>
      </div>

      {/* Scoped styles for alert pulse animation */}
      <style>{`
        @keyframes lcars-alert-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
