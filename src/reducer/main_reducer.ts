import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CharacterDataList,
  DailyStats,
  SettingsData,
  TranscriptedWord,
} from "../types";

const initialState = {
  initialLoad: false,
  isLoading: false,
  characters: <CharacterDataList>{},
  dailyStats: <DailyStats>{},
  settings: <SettingsData>{},
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
      state.settings = {};
    },
    loadDataSuccess: (
      state,
      action: PayloadAction<{
        characters: CharacterDataList;
        dailyStats: DailyStats;
        settings: SettingsData;
      }>
    ) => {
      state.isLoading = false;
      state.characters = action.payload.characters;
      state.dailyStats = action.payload.dailyStats;
      state.settings = action.payload.settings;
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
    saveSettings: (state, _action: PayloadAction<SettingsData>) => {
      state.isLoading = true;
    },
    saveSettingsSuccess: (state, action: PayloadAction<SettingsData>) => {
      state.isLoading = false;
      state.settings = action.payload;
    },
    saveSettingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      console.log(action.payload);
    },
  },
  selectors: {
    selectIsInitialLoad: (state) => state.initialLoad,
    selectIsLoading: (state) => state.isLoading,
    selectCharacters: (state) => state.characters,
    selectDailyStats: (state) => state.dailyStats,
    selectSettings: (state) => state.settings,
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
  saveSettings,
  saveSettingsSuccess,
  saveSettingsFailure,
} = mainSlice.actions;

// SELECTORS
export const {
  selectCharacters,
  selectIsInitialLoad,
  selectIsLoading,
  selectDailyStats,
  selectSettings,
} = mainSlice.selectors;

const mainReducer = mainSlice.reducer;
export default mainReducer;
