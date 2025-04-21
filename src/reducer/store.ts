import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./main_reducer";

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
});
