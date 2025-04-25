import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import TypeModePage from "./pages/type-mode";
import NotFoundPage from "./pages/not-found";
import DefaultTemplate from "./templates/default";

function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultTemplate>
            <HomePage />
          </DefaultTemplate>
        }
      />
      <Route
        path="/type-mode"
        element={
          <DefaultTemplate>
            <TypeModePage />
          </DefaultTemplate>
        }
      />
      <Route
        path="*"
        element={
          <DefaultTemplate>
            <NotFoundPage />
          </DefaultTemplate>
        }
      />
    </Routes>
  );
}

export default Router;
