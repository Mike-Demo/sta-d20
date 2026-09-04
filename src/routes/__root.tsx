import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

// ported from main.tsx — self-hosted fonts (no third-party requests)
import "@fontsource/antonio/latin-400.css";
import "@fontsource/antonio/latin-700.css";
import "@fontsource/orbitron/latin-400.css";
import "@fontsource/orbitron/latin-700.css";
// Press Start 2P loaded on-demand by themes.ts when pixel themes are activated

import SplashScreen from "@/components/SplashScreen";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { applyTheme, getTheme } from "@/lib/themes";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "../styles.css?url";

// ported from App.tsx — restore saved theme before the first client paint.
// Guarded: TanStack Start evaluates this module during SSR where document is absent.
if (typeof window !== "undefined") {
  applyTheme(getTheme());
}

const SITE_TITLE = "Star Trek Adventures 2d20 Dice Roller — LCARS‑Style Tool";
const SITE_DESCRIPTION =
  "2d20 dice roller for STA 2e. Roll d20s and challenge dice, track successes, complications, and rerolls in a clean, rules‑accurate LCARS interface.";

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "2d20.space — Star Trek Adventures Dice Roller",
  alternateName: "Star Trek Adventures 2d20 Task Roller",
  url: "https://2d20.space",
  image: "https://2d20.space/social-card.png",
  description:
    "A fast, LCARS-inspired Star Trek Adventures 2d20 dice roller for STA 2e. Roll d20s and challenge dice, track successes, complications, and effects in a clean, rules-accurate interface.",
  applicationCategory: "GameUtility",
  genre: "Tabletop RPG",
  operatingSystem: "Web",
  softwareVersion: "1.0.0",
  author: { "@type": "Person", name: "Mike Demo", url: "https://2d20.space" },
  publisher: { "@type": "Person", name: "Mike Demo" },
  creator: { "@type": "Person", name: "Mike Demo" },
  maintainer: { "@type": "Person", name: "Mike Demo" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  audience: { "@type": "Audience", audienceType: "Tabletop RPG players" },
  keywords: [
    "Star Trek Adventures",
    "2d20",
    "dice roller",
    "task system",
    "LCARS",
    "TTRPG",
    "Modiphius",
  ],
  license: {
    "@type": "CreativeWork",
    name: "WTFPL v2",
    url: "https://2d20.space/license.txt",
    text: "DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE — Version 2, December 2004. Everyone is permitted to copy and distribute verbatim or modified copies of this license document, and changing it is allowed as long as the name is changed. 0. You just DO WHAT THE FUCK YOU WANT TO.",
  },
  creditText:
    "Star Trek Adventures is a trademark of Modiphius Entertainment. This tool is a fan-made utility and is not affiliated with or endorsed by Modiphius, CBS Studios, or Paramount.",
  citation: [
    "Star Trek Adventures 2nd Edition Core Rulebook (Modiphius Entertainment)",
    "LCARS design language inspired by Star Trek computer interfaces",
    "WTFPL v2 License by Sam Hocevar",
  ],
  isBasedOn: [
    {
      "@type": "CreativeWork",
      name: "Star Trek Adventures 2nd Edition",
      publisher: "Modiphius Entertainment",
    },
  ],
  isAccessibleForFree: true,
  featureList: [
    "2d20 dice rolling",
    "Complication range calculation",
    "Success counting",
    "Task difficulty evaluation",
    "LCARS-inspired interface",
  ],
  dateCreated: "2026-02-22",
  datePublished: "2026-02-23",
  dateModified: "2026-08-31",
  inLanguage: "en",
  accessibilityAPI: ["ARIA"],
  accessibilityControl: ["fullKeyboardControl", "voiceControl", "pointer"],
  accessibilityFeature: [
    "alternativeText",
    "highContrastDisplay",
    "displayTransformability",
    "structuralNavigation",
    "ARIA",
    "keyboardNavigation",
  ],
  accessibilityHazard: ["noFlashingHazard", "noMotionSimulationHazard", "noSoundHazard"],
  accessMode: ["textual", "visual"],
  accessModeSufficient: ["textual"],
  accessibilitySummary:
    "This LCARS‑style dice roller is designed to be accessible to as many users as possible. It supports keyboard navigation, screen readers, high‑contrast viewing, and responsive display scaling. The interface contains no flashing content, motion simulation, or audio hazards.",
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "STA2E-D20" },
      { name: "theme-color", content: "#141a2e" },
      { name: "application-name", content: "STA2E-D20" },
      { name: "referrer", content: "no-referrer" },
      {
        httpEquiv: "Permissions-Policy",
        content: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
      },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: "https://2d20.space/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://2d20.space/social-card.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: "https://2d20.space/social-card.png" },
      { name: "author", content: "MikeDemo" },
      { name: "generator", content: "Lovable" },
      {
        name: "keywords",
        content:
          "Star Trek Adventures, STA 2e, D20 roller, dice roller, LCARS, tabletop RPG, Star Trek RPG, 2d20 system, TTRPG tools, Star Trek Adventures 2nd Edition",
      },
      { name: "license", content: "WTFPL v2 — /license.txt" },
    ],
    links: [
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.12.0/dist/styles/webawesome.css" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.3.1/css/all.min.css" },
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", href: "/pwa-icon-512.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(softwareApplicationJsonLd),
      },
      {
        // ported from index.html — registers the project's hand-rolled service
        // worker (public/sw.js, cache "sta2e-v1"); preserves offline support.
        children:
          'if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js"); }',
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SplashScreen />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  console.error(error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-display text-primary">This page didn't load</h1>
        <p className="text-muted-foreground">
          Something went wrong on our end. You can try again or head back home.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="lcars-pill bg-primary text-primary-foreground px-5 py-2 font-lcars"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a
            href="/"
            className="lcars-pill bg-secondary text-secondary-foreground px-5 py-2 font-lcars"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
