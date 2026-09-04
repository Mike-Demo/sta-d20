import { ReactNode, useEffect, useRef, useState } from "react";
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
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
  }
}

type GateStatus = "checking" | "ready" | "verifying" | "failed" | "passed";

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
  const [status, setStatus] = useState<GateStatus>("checking");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG) === "1") {
      setStatus("passed");
      return;
    }

    let cancelled = false;

    const onToken = (token: string) => {
      setStatus("verifying");
      void verifyCaptcha({ data: { token } })
        .then((result) => {
          if (cancelled) return;
          if (result.success) {
            sessionStorage.setItem(SESSION_FLAG, "1");
            setStatus("passed");
          } else {
            setStatus("failed");
          }
        })
        .catch(() => {
          if (!cancelled) setStatus("failed");
        });
    };

    loadHCaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.hcaptcha) return;
        window.hcaptcha.render(containerRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          callback: onToken,
          "expired-callback": () => setStatus("ready"),
          "error-callback": () => setStatus("ready"),
          theme: "dark",
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "passed") {
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
            : status === "failed"
              ? "Verification failed. Please reload and try again."
              : "Confirm you're human to access the dice roller."}
        </p>
        <div className="flex justify-center min-h-[78px]">
          {status !== "verifying" && status !== "failed" && (
            <div ref={containerRef} aria-label="hCaptcha challenge" />
          )}
          {status === "verifying" && (
            <span className="text-primary font-display text-xs tracking-widest uppercase animate-pulse">
              Consulting the ship's computer…
            </span>
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
