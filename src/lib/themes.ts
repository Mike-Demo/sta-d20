export type ThemeId =
  | "lower-decks-padd"
  | "lower-decks"
  | "classic"
  | "classic-ultra"
  | "nemesis-blue"
  | "nemesis-blue-ultra"
  | "strategic-ops";

interface ThemeDefinition {
  name: string;
  era: string;
  /** Key preview colors (hex) for swatch display */
  swatches: string[];
  /** CSS custom property overrides as HSL value strings (no hsl() wrapper) */
  vars: Record<string, string>;
}

const STORAGE_KEY = "lcars-theme";

/**
 * Lower Decks PADD is the default — its values live in :root in index.css,
 * so we store an empty vars object (applyTheme clears overrides).
 */
export const themes: Record<ThemeId, ThemeDefinition> = {
  "lower-decks-padd": {
    name: "Lower Decks PADD",
    era: "2380s",
    swatches: ["#5588ee", "#66ccff", "#88ffff", "#7799dd"],
    vars: {},
  },

  "lower-decks": {
    name: "Lower Decks",
    era: "2380s",
    swatches: ["#ff7700", "#ffaa44", "#ff9911", "#cc5500"],
    vars: {
      "--background": "20 30% 10%",
      "--foreground": "33 80% 92%",
      "--card": "20 25% 14%",
      "--card-foreground": "33 80% 92%",
      "--popover": "20 25% 14%",
      "--popover-foreground": "33 80% 92%",
      "--primary": "28 100% 50%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "25 100% 40%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "20 25% 18%",
      "--muted-foreground": "33 60% 78%",
      "--accent": "33 100% 90%",
      "--accent-foreground": "20 30% 10%",
      "--destructive": "16 100% 50%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "20 20% 22%",
      "--input": "20 20% 22%",
      "--ring": "28 100% 50%",
      "--lcars-alpha-blue": "28 100% 50%",
      "--lcars-arctic-ice": "33 100% 63%",
      "--lcars-arctic-snow": "30 100% 80%",
      "--lcars-radioactive": "33 100% 90%",
      "--lcars-beta-blue": "25 100% 40%",
      "--lcars-night-cloud": "20 25% 20%",
      "--lcars-night-rain": "33 100% 53%",
      "--lcars-sunset-red": "16 100% 50%",
      "--lcars-gold": "33 100% 63%",
    },
  },

  classic: {
    name: "Classic",
    era: "TNG/DS9/VOY",
    swatches: ["#cc99ff", "#ff9966", "#ff8800", "#99ccff"],
    vars: {
      "--background": "260 20% 10%",
      "--foreground": "270 60% 92%",
      "--card": "260 18% 15%",
      "--card-foreground": "270 60% 92%",
      "--popover": "260 18% 15%",
      "--popover-foreground": "270 60% 92%",
      "--primary": "270 100% 80%",
      "--primary-foreground": "260 20% 10%",
      "--secondary": "20 100% 70%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "240 15% 22%",
      "--muted-foreground": "240 15% 65%",
      "--accent": "210 100% 80%",
      "--accent-foreground": "260 20% 10%",
      "--destructive": "8 100% 50%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "260 15% 24%",
      "--input": "260 15% 24%",
      "--ring": "270 100% 70%",
      "--lcars-alpha-blue": "20 100% 70%",
      "--lcars-arctic-ice": "210 100% 80%",
      "--lcars-arctic-snow": "10 100% 83%",
      "--lcars-radioactive": "40 100% 50%",
      "--lcars-beta-blue": "270 100% 80%",
      "--lcars-night-cloud": "240 15% 47%",
      "--lcars-night-rain": "260 100% 70%",
      "--lcars-sunset-red": "8 100% 50%",
      "--lcars-gold": "40 100% 50%",
    },
  },

  "classic-ultra": {
    name: "Classic Ultra",
    era: "TNG/DS9/VOY",
    swatches: ["#dd99ff", "#ff9966", "#ff9900", "#aaddff"],
    vars: {
      "--background": "260 22% 8%",
      "--foreground": "270 80% 95%",
      "--card": "260 20% 13%",
      "--card-foreground": "270 80% 95%",
      "--popover": "260 20% 13%",
      "--popover-foreground": "270 80% 95%",
      "--primary": "270 100% 82%",
      "--primary-foreground": "260 22% 8%",
      "--secondary": "20 100% 72%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "240 15% 20%",
      "--muted-foreground": "240 15% 70%",
      "--accent": "210 100% 84%",
      "--accent-foreground": "260 22% 8%",
      "--destructive": "8 100% 52%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "260 15% 22%",
      "--input": "260 15% 22%",
      "--ring": "270 100% 75%",
      "--lcars-alpha-blue": "20 100% 72%",
      "--lcars-arctic-ice": "210 100% 84%",
      "--lcars-arctic-snow": "10 100% 86%",
      "--lcars-radioactive": "40 100% 52%",
      "--lcars-beta-blue": "270 100% 82%",
      "--lcars-night-cloud": "240 15% 42%",
      "--lcars-night-rain": "260 100% 72%",
      "--lcars-sunset-red": "8 100% 52%",
      "--lcars-gold": "40 100% 52%",
    },
  },

  "nemesis-blue": {
    name: "Nemesis Blue",
    era: "TNG Films",
    swatches: ["#6699ff", "#2266ff", "#88bbff", "#ebf0ff"],
    vars: {
      "--background": "222 30% 10%",
      "--foreground": "222 60% 92%",
      "--card": "222 25% 14%",
      "--card-foreground": "222 60% 92%",
      "--popover": "222 25% 14%",
      "--popover-foreground": "222 60% 92%",
      "--primary": "220 100% 70%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "222 100% 57%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "240 12% 20%",
      "--muted-foreground": "222 30% 70%",
      "--accent": "222 100% 96%",
      "--accent-foreground": "222 30% 10%",
      "--destructive": "355 71% 47%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "222 20% 22%",
      "--input": "222 20% 22%",
      "--ring": "220 100% 65%",
      "--lcars-alpha-blue": "222 100% 57%",
      "--lcars-arctic-ice": "216 100% 76%",
      "--lcars-arctic-snow": "222 100% 96%",
      "--lcars-radioactive": "220 100% 70%",
      "--lcars-beta-blue": "240 12% 37%",
      "--lcars-night-cloud": "222 20% 25%",
      "--lcars-night-rain": "30 100% 80%",
      "--lcars-sunset-red": "355 71% 47%",
      "--lcars-gold": "30 100% 80%",
    },
  },

  "nemesis-blue-ultra": {
    name: "Nemesis Blue Ultra",
    era: "TNG Films",
    swatches: ["#7799ff", "#3377ff", "#99ccff", "#ebf0ff"],
    vars: {
      "--background": "222 35% 8%",
      "--foreground": "222 70% 95%",
      "--card": "222 28% 12%",
      "--card-foreground": "222 70% 95%",
      "--popover": "222 28% 12%",
      "--popover-foreground": "222 70% 95%",
      "--primary": "220 100% 73%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "222 100% 60%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "240 12% 18%",
      "--muted-foreground": "222 35% 75%",
      "--accent": "222 100% 97%",
      "--accent-foreground": "222 35% 8%",
      "--destructive": "355 75% 50%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "222 22% 20%",
      "--input": "222 22% 20%",
      "--ring": "220 100% 68%",
      "--lcars-alpha-blue": "222 100% 60%",
      "--lcars-arctic-ice": "216 100% 80%",
      "--lcars-arctic-snow": "222 100% 97%",
      "--lcars-radioactive": "220 100% 73%",
      "--lcars-beta-blue": "240 14% 40%",
      "--lcars-night-cloud": "222 22% 22%",
      "--lcars-night-rain": "30 100% 82%",
      "--lcars-sunset-red": "355 75% 50%",
      "--lcars-gold": "30 100% 82%",
    },
  },

  "strategic-ops": {
    name: "Strategic Ops",
    era: "1983 Sega Arcade",
    swatches: ["#00ff00", "#00aaff", "#ff0000", "#ffff00"],
    vars: {
      "--background": "0 0% 2%",
      "--foreground": "120 100% 70%",
      "--card": "0 0% 5%",
      "--card-foreground": "120 100% 70%",
      "--popover": "0 0% 5%",
      "--popover-foreground": "120 100% 70%",
      "--primary": "120 100% 50%",
      "--primary-foreground": "0 0% 0%",
      "--secondary": "200 100% 50%",
      "--secondary-foreground": "0 0% 0%",
      "--muted": "0 0% 8%",
      "--muted-foreground": "120 60% 55%",
      "--accent": "60 100% 50%",
      "--accent-foreground": "0 0% 0%",
      "--destructive": "0 100% 50%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "120 100% 20%",
      "--input": "120 100% 20%",
      "--ring": "120 100% 50%",
      "--lcars-alpha-blue": "200 100% 50%",
      "--lcars-arctic-ice": "120 100% 50%",
      "--lcars-arctic-snow": "60 100% 50%",
      "--lcars-radioactive": "120 100% 70%",
      "--lcars-beta-blue": "0 100% 50%",
      "--lcars-night-cloud": "0 0% 10%",
      "--lcars-night-rain": "120 100% 30%",
      "--lcars-sunset-red": "0 100% 50%",
      "--lcars-gold": "60 100% 50%",
    },
  },
};

export const themeIds = Object.keys(themes) as ThemeId[];

export function getTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in themes) return stored as ThemeId;
  return "lower-decks-padd";
}

export function setTheme(id: ThemeId) {
  localStorage.setItem(STORAGE_KEY, id);
}

export function applyTheme(id: ThemeId) {
  const style = document.documentElement.style;
  // Clear any previously set theme overrides
  for (const theme of Object.values(themes)) {
    for (const prop of Object.keys(theme.vars)) {
      style.removeProperty(prop);
    }
  }
  // Apply new theme vars (empty for default)
  const { vars } = themes[id];
  for (const [prop, value] of Object.entries(vars)) {
    style.setProperty(prop, value);
  }

  // Toggle pixel font for Strategic Ops theme
  const pixelFont = "'Press Start 2P', monospace";
  const defaultLcars = "Antonio, Orbitron, sans-serif";
  const defaultDisplay = "Orbitron, Antonio, sans-serif";
  if (id === "strategic-ops") {
    document.documentElement.classList.add("theme-strategic-ops");
    style.setProperty("--font-lcars", pixelFont);
    style.setProperty("--font-display", pixelFont);
  } else {
    document.documentElement.classList.remove("theme-strategic-ops");
    style.setProperty("--font-lcars", defaultLcars);
    style.setProperty("--font-display", defaultDisplay);
  }

  setTheme(id);
}
