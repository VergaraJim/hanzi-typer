import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import TypeModePage from "./pages/type-mode";
import NotFoundPage from "./pages/not-found";
import DefaultTemplate from "./templates/default";
import useHistory from "./hooks/use-history";

function Router() {
  const history = useHistory();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultTemplate history={history}>
            <HomePage />
          </DefaultTemplate>
        }
      />
      <Route
        path="/type-mode"
        element={
          <DefaultTemplate history={history}>
            <TypeModePage />
          </DefaultTemplate>
        }
      />
      <Route
        path="*"
        element={
          <DefaultTemplate history={history}>
            <NotFoundPage />
          </DefaultTemplate>
        }
      />
    </Routes>
  );
}

export default Router;
