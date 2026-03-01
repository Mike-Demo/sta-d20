import { useState, useEffect, useRef } from "react";
import { themes, themeIds, getTheme, applyTheme, type ThemeId } from "@/lib/themes";

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeId>(getTheme);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative z-50">
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
