import { put, select, takeLatest } from "redux-saga/effects";
import {
  loadData,
  loadDataFailure,
  loadDataSuccess,
  saveTypeData,
  saveCharactersDataFailure,
  saveCharactersDataSuccess,
  selectCharacters,
  saveGuessedWord,
  saveNewWord,
} from "../reducer/main_reducer";
import { CharacterDataList, TranscriptedWord } from "../types";
import { PayloadAction } from "@reduxjs/toolkit";
import { dailyStatsDto } from "../dtos/daily-stats-dto";

function* loadDataWorker() {
  try {
    let characterList: CharacterDataList = {};
    let data: Object | null = JSON.parse(
      localStorage.getItem("characterData") || "{}"
    );
    // Check if it's null
    if (!data) {
      // No data, set it to empty;
      data = {};
      localStorage.setItem("characterData", JSON.stringify(data));
    }
    characterList = data as CharacterDataList;
    yield put(
      loadDataSuccess({
        characters: characterList,
        dailyStats: dailyStatsDto.getData(),
      })
    );
  } catch (error) {
    yield put(loadDataFailure("Error Message"));
  }
}

function* saveTypeDataWorker(action: PayloadAction<Array<TranscriptedWord>>) {
  try {
    // Wait minimum 500 ms
    yield new Promise((resolve) => setTimeout(resolve, 500));
    // Get the data and clean it
    const _characters: CharacterDataList = yield select(selectCharacters);
    const characters: CharacterDataList = JSON.parse(
      JSON.stringify(_characters)
    );

    // Cycle the tanscript to get new data to add
    const transcripted = action.payload;
    transcripted.forEach((transcript) => {
      if (!Object.keys(characters).includes(transcript.word)) {
        // If it's not in the list, create it
        characters[transcript.word] = {
          tries: 0,
          correct: 0,
          wrong: 0,
          reviewDate: new Date().toString(),
          reviewDelay: 10,
        };
      }
      characters[transcript.word].tries += 1;
      if (transcript.guessed) {
        characters[transcript.word].correct += 1;
      } else {
        if (characters[transcript.word].reviewDelay / 2 > 0) {
          characters[transcript.word].reviewDelay =
            characters[transcript.word].reviewDelay / 2;
          characters[transcript.word].reviewDate = new Date().toString();
        }
        characters[transcript.word].wrong += 1;
      }
    });
    localStorage.setItem("characterData", JSON.stringify(characters));
    yield put(
      saveCharactersDataSuccess({
        characters,
      })
    );
  } catch (Error) {
    yield put(saveCharactersDataFailure("Error Message"));
  }
}

function* saveGuessedWordWorker(
  action: PayloadAction<{ word: string; skipped: boolean }>
) {
  try {
    // Wait minimum 500 ms
    yield new Promise((resolve) => setTimeout(resolve, 500));
    // Get the data and clean it
    const _characters: CharacterDataList = yield select(selectCharacters);
    const characters: CharacterDataList = JSON.parse(
      JSON.stringify(_characters)
    );

    const character = characters[action.payload.word];
    if (!action.payload.skipped) {
      character.reviewDelay *= 1.5;
    }
    character.reviewDate = new Date(
      new Date().getTime() + character.reviewDelay * 60000
    ).toString();
    characters[action.payload.word] = character;

    localStorage.setItem("characterData", JSON.stringify(characters));
    dailyStatsDto.addReviewed();
    yield put(
      saveCharactersDataSuccess({
        characters,
        dailyStats: dailyStatsDto.getData(),
      })
    );
  } catch (Error) {
    yield put(saveCharactersDataFailure("Error Message"));
  }
}

function* saveNewWordWorker(action: PayloadAction<{ word: string }>) {
  try {
    // Wait minimum 500 ms
    yield new Promise((resolve) => setTimeout(resolve, 500));
    // Get the data and clean it
    const _characters: CharacterDataList = yield select(selectCharacters);
    const characters: CharacterDataList = JSON.parse(
      JSON.stringify(_characters)
    );

    // Add new word
    characters[action.payload.word] = {
      tries: 0,
      correct: 0,
      wrong: 0,
      reviewDate: new Date(new Date().getTime() + 60 * 60000).toString(), // Set review to 1 hour
      reviewDelay: 10,
    };

    localStorage.setItem("characterData", JSON.stringify(characters));
    dailyStatsDto.addLearned();
    yield put(
      saveCharactersDataSuccess({
        characters,
        dailyStats: dailyStatsDto.getData(),
      })
    );
  } catch (Error) {
    yield put(saveCharactersDataFailure("Error Message"));
  }
}

export function* mainSaga() {
  yield takeLatest(loadData.type, loadDataWorker);
  yield takeLatest(saveTypeData.type, saveTypeDataWorker);
  yield takeLatest(saveGuessedWord.type, saveGuessedWordWorker);
  yield takeLatest(saveNewWord.type, saveNewWordWorker);
}
