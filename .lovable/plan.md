

## Reducing Environmental Impact -- Sustainable Web Design Model v4

The SWDM v4 framework uses **data transfer as the primary proxy for energy use**. Less bytes transferred = less energy consumed across networks, data centers, and devices. Here is what we can do.

### Current State

Your app is already well-optimized in several ways:
- Dark theme by default (reduces OLED display energy)
- Code-splitting with lazy routes
- PWA with service worker caching
- Self-hosted fonts (no third-party requests)
- Strict CSP preventing external resource loading
- No analytics or tracking scripts

However, the project carries significant **dead weight** from unused dependencies that inflate the bundle.

---

### 1. Remove ~30 unused dependencies (biggest impact)

The app only imports 5 UI components (dialog, collapsible, scroll-area, toaster/sonner, tooltip), but ships with 40+ Radix packages and many unused libraries. Removing them eliminates dead code from the install/build pipeline and reduces bundle size.

**Unused packages to remove:**

- `@tanstack/react-query` -- not imported anywhere
- `@hookform/resolvers`, `react-hook-form` -- only used in unused `form.tsx` UI component
- `zod` -- only used with react-hook-form
- `date-fns`, `react-day-picker` -- only in unused `calendar.tsx`
- `embla-carousel-react` -- only in unused `carousel.tsx`
- `input-otp` -- only in unused `input-otp.tsx`
- `cmdk` -- only in unused `command.tsx`
- `react-resizable-panels` -- only in unused `resizable.tsx`
- `vaul` -- only in unused `drawer.tsx`
- `next-themes` -- only in unused `sonner.tsx` theme hook (sonner still works without it)
- ~25 Radix UI packages that are only used by unused UI component files (accordion, alert-dialog, aspect-ratio, avatar, checkbox, context-menu, dropdown-menu, hover-card, menubar, navigation-menu, popover, progress, radio-group, select, separator, slider, switch, tabs, toggle, toggle-group)

**Keep:** `@radix-ui/react-dialog`, `@radix-ui/react-collapsible`, `@radix-ui/react-scroll-area`, `@radix-ui/react-toast`, `@radix-ui/react-tooltip`, `@radix-ui/react-slot`, `@radix-ui/react-label` (used by active components)

### 2. Delete unused UI component files

Remove the ~30 unused component files in `src/components/ui/` that correspond to the removed packages. Keep only: `dialog.tsx`, `collapsible.tsx`, `scroll-area.tsx`, `toast.tsx`, `toaster.tsx`, `tooltip.tsx`, `sonner.tsx`, `button.tsx`, and any others actually imported.

### 3. Remove unused static assets

- Delete `public/placeholder.svg` -- not referenced anywhere in the codebase
- Delete `public/favicon.ico` -- redundant with `favicon.png` and `pwa-icon.svg`
- Consider removing `public/pwa-icon-180.png` if `pwa-icon-192.png` and the SVG cover all use cases

### 4. Fix Sonner to not depend on `next-themes`

The `sonner.tsx` component imports `useTheme` from `next-themes`, but the app doesn't use theme switching. Replace this with a hardcoded `theme="dark"` prop so `next-themes` can be removed entirely.

### 5. Add font `display: swap` and subset

The font imports load full character sets. Adding `display: swap` ensures text renders immediately with a fallback while fonts load, reducing perceived load time and avoiding invisible text that wastes energy on re-renders.

### 6. Add `loading="lazy"` to non-critical images

The PWA icon in the splash screen and any other images should use native lazy loading to defer off-screen image fetches.

---

### Estimated Impact

| Change | Data Saved (approx.) |
|---|---|
| Remove ~30 unused packages | ~200-400 KB from install, faster builds |
| Delete unused UI files | ~50 KB source, cleaner tree-shaking |
| Remove unused assets | ~20-50 KB per page load |
| Fix sonner theme dependency | ~15 KB (next-themes bundle) |

### Files Changed

- `package.json` -- remove unused dependencies
- `src/components/ui/sonner.tsx` -- hardcode dark theme
- Delete ~25-30 unused files from `src/components/ui/`
- Delete `public/placeholder.svg`
- No changes to the app's design, layout, or functionality

