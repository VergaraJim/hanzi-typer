import { Route, Routes } from "react-router-dom";
import DefaultTemplate from "./templates/default";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect } from "react";
import {
  loadData,
  selectIsInitialLoad,
  selectIsLoading,
} from "./reducer/main_reducer";

const HomePage = lazy(() => import("./pages/home"));
const LearnPage = lazy(() => import("./pages/learn"));
const TypeModePage = lazy(() => import("./pages/type-mode"));
const CharacterListPage = lazy(() => import("./pages/character-list"));
const ReviewPage = lazy(() => import("./pages/review"));
const NotFoundPage = lazy(() => import("./pages/not-found"));

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
        path="/learn"
        element={
          <DefaultTemplate>
            <LearnPage />
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
        path="/review"
        element={
          <DefaultTemplate>
            <ReviewPage />
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
