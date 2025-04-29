import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CharacterDataList, TranscriptedCharacter } from "../types";

const initialState = {
  initialLoad: false,
  isLoading: false,
  characters: <CharacterDataList>{},
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
      console.log(action.payload);
    },
    saveTypeData: (
      state,
      _action: PayloadAction<Array<TranscriptedCharacter>>
    ) => {
      state.isLoading = true;
    },
    saveCharactersDataSuccess: (
      state,
      action: PayloadAction<CharacterDataList>
    ) => {
      state.isLoading = false;
      state.characters = action.payload;
    },
    saveCharactersDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      console.log(action.payload);
    },
  },
  selectors: {
    selectIsInitialLoad: (state) => state.initialLoad,
    selectIsLoading: (state) => state.isLoading,
    selectCharacters: (state) => state.characters,
  },
});

// ACTIONS
export const {
  reset,
  loadData,
  loadDataSuccess,
  loadDataFailure,
  saveTypeData,
  saveCharactersDataSuccess,
  saveCharactersDataFailure,
} = mainSlice.actions;

// SELECTORS
export const { selectCharacters, selectIsInitialLoad, selectIsLoading } =
  mainSlice.selectors;

const mainReducer = mainSlice.reducer;
export default mainReducer;
