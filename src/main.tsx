import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./reducer/store";
import HomePage from "./pages/home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="w-dvw h-dvh bg-stone-800 text-stone-100 overflow-auto">
        <HomePage />
      </div>
    </Provider>
  </StrictMode>
);
