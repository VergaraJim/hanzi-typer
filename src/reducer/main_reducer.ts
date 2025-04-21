import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { reset } = mainSlice.actions;
const mainReducer = mainSlice.reducer;
export default mainReducer;
