import { useState, useEffect, useRef, useCallback } from "react";
import { themes, themeIds, getTheme, applyTheme, type ThemeId } from "@/lib/themes";

const CRT_KEY = "lcars-crt";

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  // Defaults render identically on server and client; stored values are read
  // after mount to avoid SSR localStorage access and hydration mismatches.
  const [current, setCurrent] = useState<ThemeId>("lower-decks-padd");
  const [crt, setCrt] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getTheme());
    setCrt(localStorage.getItem(CRT_KEY) !== "off");
  }, []);

  const applyCrt = useCallback((on: boolean) => {
    const isRetro = current === "strategic-ops" || current === "25th-anniversary";
    document.documentElement.classList.toggle("crt-scanlines", on && isRetro);
  }, [current]);

  useEffect(() => {
    applyCrt(crt);
  }, [crt, applyCrt]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = (id: ThemeId) => {
    applyTheme(id);
    setCurrent(id);
    setOpen(false);
  };

  const toggleCrt = () => {
    const next = !crt;
    setCrt(next);
    localStorage.setItem(CRT_KEY, next ? "on" : "off");
  };

  const isRetroTheme = current === "strategic-ops" || current === "25th-anniversary";

  return (
    <div ref={ref} className="relative z-50 flex items-stretch gap-0">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch LCARS theme"
        className="bg-lcars-night-rain hover:bg-lcars-beta-blue transition-colors h-12 w-12 flex items-center justify-center"
      >
        <span className="flex flex-wrap gap-0.5 w-4 h-4 items-center justify-center">
          {themes[current].swatches.slice(0, 4).map((c, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c }} />
          ))}
        </span>
      </button>

      {isRetroTheme && (
        <button
          onClick={toggleCrt}
          aria-label={crt ? "Disable CRT scanlines" : "Enable CRT scanlines"}
          title={crt ? "CRT: ON" : "CRT: OFF"}
          className={`h-12 w-10 flex items-center justify-center text-[9px] font-bold font-lcars tracking-wider transition-colors ${
            crt
              ? "bg-lcars-arctic-ice text-accent-foreground"
              : "bg-lcars-night-cloud text-muted-foreground"
          }`}
        >
          CRT
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-sm shadow-lg min-w-[220px] overflow-hidden">
          {themeIds.map((id) => {
            const t = themes[id];
            const active = id === current;
            return (
              <button
                key={id}
                onClick={() => select(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  active ? "bg-primary/20 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="flex gap-1 flex-shrink-0">
                  {t.swatches.map((c, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full inline-block border border-border" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-wider uppercase font-lcars">{t.name}</span>
                  <span className="text-[9px] text-muted-foreground tracking-wide">{t.era}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
