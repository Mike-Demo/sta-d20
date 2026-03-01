import { createRoot } from "react-dom/client";
import "@fontsource/antonio/latin-400.css";
import "@fontsource/antonio/latin-700.css";
import "@fontsource/orbitron/latin-400.css";
import "@fontsource/orbitron/latin-700.css";
// Press Start 2P loaded on-demand by themes.ts when pixel themes are activated
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
