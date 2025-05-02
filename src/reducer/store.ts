import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./main_reducer";
import rootSaga from "../sagas/saga";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

sagaMiddleware.run(rootSaga);
