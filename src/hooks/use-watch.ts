import { useState, useEffect } from "react";

const WATCH_BREAKPOINT = 220;

export function useIsWatch() {
  const [isWatch, setIsWatch] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${WATCH_BREAKPOINT}px)`);
    const onChange = () => setIsWatch(mql.matches);
    mql.addEventListener("change", onChange);
    setIsWatch(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isWatch;
}
