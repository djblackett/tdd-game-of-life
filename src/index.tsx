import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import React from "react";
import "./styles.css";

// @ts-ignore
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);