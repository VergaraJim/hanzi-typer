import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CharacterDataList } from "../types";

const initialState = {
  initialLoad: false,
  isLoading: false,
  characters: {},
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    reset: (state) => {
      state.characters = {};
    },
    loadData: (state) => {
      state.initialLoad = true;
      state.isLoading = true;
      state.characters = {};
    },
    loadDataSuccess: (state, action: PayloadAction<CharacterDataList>) => {
      state.isLoading = false;
      state.characters = action.payload;
    },
    loadDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
    },
  },
});

export const { reset, loadData, loadDataSuccess, loadDataFailure } =
  mainSlice.actions;
const mainReducer = mainSlice.reducer;
export default mainReducer;
