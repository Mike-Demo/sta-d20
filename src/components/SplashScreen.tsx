import { useState, useEffect } from "react";

const SplashScreen = () => {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  const [phase, setPhase] = useState<"visible" | "fading" | "gone">(
    isStandalone ? "visible" : "gone"
  );

  useEffect(() => {
    if (!isStandalone) return;
    const fadeTimer = setTimeout(() => setPhase("fading"), 2000);
    const removeTimer = setTimeout(() => setPhase("gone"), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background ${
        phase === "fading" ? "splash-fade-out pointer-events-none" : ""
      }`}
    >
      {/* Pulsing star icon */}
      <div className="splash-pulse mb-6">
        <img
          src="/pwa-icon.svg"
          alt="Star Trek"
          width="80"
          height="80"
          className="drop-shadow-[0_0_15px_hsl(var(--lcars-alpha-blue)/0.6)]"
        />
      </div>

      {/* Title */}
      <h1
        className="font-display text-3xl tracking-widest text-primary"
        style={{ textShadow: "0 0 20px hsl(var(--lcars-alpha-blue) / 0.6)" }}
      >
        STA2E-D20
      </h1>

      {/* LCARS scanning bar */}
      <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 rounded-full bg-primary lcars-blink animate-[splash-scan_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default SplashScreen;
