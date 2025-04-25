import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./reducer/store";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/hanzi-typer">
        <Router />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
