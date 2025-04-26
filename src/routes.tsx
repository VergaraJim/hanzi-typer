import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import TypeModePage from "./pages/type-mode";
import NotFoundPage from "./pages/not-found";
import DefaultTemplate from "./templates/default";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducer/store";
import { useEffect } from "react";
import {
  loadData,
  selectIsInitialLoad,
  selectIsLoading,
} from "./reducer/main_reducer";
import CharacterListPage from "./pages/character-list";

function Router() {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const isInitialLoad = useSelector(selectIsInitialLoad);

  useEffect(() => {
    if (!isLoading && !isInitialLoad) {
      dispatch(loadData());
    }
  }, []);

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
        path="/character-list"
        element={
          <DefaultTemplate>
            <CharacterListPage />
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
