import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./reducer/store";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

createRoot(document.getElementById("root")!).render(
  // DEBUG: Quick rerender is because of StrictMode
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/hanzi-typer/">
        <Suspense
          fallback={
            <div className="flex justify-center items-center text-white w-dvw h-dvh">
              Loading...
            </div>
          }
        >
          <Router />
        </Suspense>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
