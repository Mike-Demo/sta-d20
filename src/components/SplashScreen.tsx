import { useState, useEffect } from "react";

const SplashScreen = () => {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
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
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="40,8 47,30 70,30 51,44 58,66 40,52 22,66 29,44 10,30 33,30"
            fill="hsl(var(--lcars-gold))"
          />
        </svg>
      </div>

      {/* Title */}
      <h1
        className="font-display text-3xl tracking-widest text-primary"
        style={{ textShadow: "0 0 20px hsl(var(--lcars-gold) / 0.6)" }}
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
