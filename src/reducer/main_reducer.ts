import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CharacterDataList, DailyStats, TranscriptedWord } from "../types";

const initialState = {
  initialLoad: false,
  isLoading: false,
  characters: <CharacterDataList>{},
  dailyStats: <DailyStats>{},
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
    loadDataSuccess: (
      state,
      action: PayloadAction<{
        characters: CharacterDataList;
        dailyStats: DailyStats;
      }>
    ) => {
      state.isLoading = false;
      state.characters = action.payload.characters;
      state.dailyStats = action.payload.dailyStats;
    },
    loadDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      console.log(action.payload);
    },
    saveTypeData: (state, _action: PayloadAction<Array<TranscriptedWord>>) => {
      state.isLoading = true;
    },
    saveReviewData: (
      state,
      _action: PayloadAction<{
        toIncrease: Array<string>;
        toRedo: Array<string>;
      }>
    ) => {
      state.isLoading = true;
    },
    saveGuessedWord: (
      state,
      _action: PayloadAction<{ word: string; skipped: boolean }>
    ) => {
      state.isLoading = true;
    },
    saveNewWord: (state, _action: PayloadAction<{ word: string }>) => {
      state.isLoading = true;
    },
    saveCharactersDataSuccess: (
      state,
      action: PayloadAction<{
        characters: CharacterDataList;
        dailyStats?: DailyStats;
      }>
    ) => {
      state.isLoading = false;
      state.characters = action.payload.characters;
      if (action.payload.dailyStats) {
        state.dailyStats = action.payload.dailyStats;
      }
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
    selectDailyStats: (state) => state.dailyStats,
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
  saveReviewData,
  saveGuessedWord,
  saveNewWord,
} = mainSlice.actions;

// SELECTORS
export const {
  selectCharacters,
  selectIsInitialLoad,
  selectIsLoading,
  selectDailyStats,
} = mainSlice.selectors;

const mainReducer = mainSlice.reducer;
export default mainReducer;
