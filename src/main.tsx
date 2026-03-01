import { createRoot } from "react-dom/client";
import "@fontsource/antonio/400.css";
import "@fontsource/antonio/700.css";
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/press-start-2p/400.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
