import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "react-pull-to-refresh/dist/index.css";

createRoot(document.getElementById("root")!).render(<App />);