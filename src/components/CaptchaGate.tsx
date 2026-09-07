import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { verifyCaptcha } from "@/lib/captcha.functions";

const HCAPTCHA_SITE_KEY = "ES_a8b041a0ff53438d9875b45684348643";
const HCAPTCHA_SCRIPT_SRC = "https://js.hcaptcha.com/1/api.js?render=explicit";
const SESSION_FLAG = "sta2e-captcha-ok";

interface HCaptchaApi {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "dark" | "light";
    },
  ) => number;
  reset: (id?: number) => void;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
  }
}

type GateStatus = "checking" | "ready" | "verifying" | "retry" | "passed";

const loadHCaptchaScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.hcaptcha) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://js.hcaptcha.com/1/api.js"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("script error")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = HCAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("script error")), { once: true });
    document.head.appendChild(script);
  });

interface CaptchaGateProps {
  children: ReactNode;
}

const CaptchaGate = ({ children }: CaptchaGateProps) => {
  // Server render and first client render show the real content, so crawlers
  // and no-JS visitors always get the page. The gate mounts after hydration.
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<GateStatus>("checking");
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const setupForAttemptRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pass = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // storage unavailable (private mode) — session flag is best-effort
    }
    setStatus("passed");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Run setup once per attempt. Re-running on every status change would
    // double-render the widget and short-circuit a pending verification.
    if (setupForAttemptRef.current === attempt) return;
    setupForAttemptRef.current = attempt;

    let alreadyPassed = false;
    try {
      alreadyPassed = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      alreadyPassed = false;
    }
    if (alreadyPassed) {
      setStatus("passed");
      return;
    }

    let cancelled = false;

    const onToken = (token: string) => {
      setStatus("verifying");
      void verifyCaptcha({ data: { token } })
        .then((result) => {
          if (cancelled) return;
          if (result.success || result.unavailable) {
            // Fail open when verification is unavailable so nobody is locked out.
            pass();
          } else {
            setStatus("retry");
          }
        })
        .catch(() => {
          // Network/server error must never lock a real person out.
          if (!cancelled) pass();
        });
    };

    loadHCaptchaScript()
      .then(() => {
        if (cancelled) return;
        if (!containerRef.current || !window.hcaptcha) {
          pass();
          return;
        }
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          callback: onToken,
          "expired-callback": () => setStatus("ready"),
          "error-callback": () => setStatus("retry"),
          theme: "dark",
        });
        setStatus("ready");
      })
      .catch(() => {
        // Blocked script (ad blocker, privacy browser, offline) — let them in.
        if (!cancelled) pass();
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, attempt, pass, status]);

  const retry = () => {
    widgetIdRef.current = null;
    setStatus("checking");
    setAttempt((n) => n + 1);
  };

  if (!mounted || status === "passed") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-4" role="group" aria-label="Human verification">
        <div className="flex items-stretch gap-2" aria-hidden="true">
          <div className="bg-lcars-arctic-ice lcars-pill-left h-8 w-16 flex-shrink-0" />
          <div className="bg-lcars-alpha-blue h-8 flex-1" />
          <div className="bg-lcars-night-rain lcars-pill-right h-8 w-12 flex-shrink-0" />
        </div>
        <h1 className="text-primary font-display text-xl font-bold tracking-[0.2em] uppercase">
          STA2E-D20
        </h1>
        <p className="text-muted-foreground text-sm">
          {status === "verifying"
            ? "Verifying…"
            : status === "retry"
              ? "That check didn't go through. Try again."
              : "Confirm you're human to access the dice roller."}
        </p>
        <div className="flex justify-center min-h-[78px]">
          {(status === "checking" || status === "ready") && (
            <div ref={containerRef} key={attempt} aria-label="hCaptcha challenge" />
          )}
          {status === "verifying" && (
            <span className="text-primary font-display text-xs tracking-widest uppercase animate-pulse">
              Consulting the ship's computer…
            </span>
          )}
          {status === "retry" && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={retry}
                className="lcars-pill bg-primary text-primary-foreground px-5 py-2 font-lcars"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={pass}
                className="text-muted-foreground text-xs underline"
              >
                Skip verification and continue
              </button>
            </div>
          )}
        </div>
        <div className="flex items-stretch gap-2" aria-hidden="true">
          <div className="bg-lcars-radioactive lcars-pill-left h-4 w-10 flex-shrink-0" />
          <div className="bg-lcars-arctic-snow h-4 flex-1" />
          <div className="bg-lcars-alpha-blue lcars-pill-right h-4 w-10 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default CaptchaGate;
