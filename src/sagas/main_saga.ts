import { put, select, takeLatest } from "redux-saga/effects";
import {
  loadData,
  loadDataFailure,
  loadDataSuccess,
  saveTypeData,
  saveCharactersDataFailure,
  saveCharactersDataSuccess,
  selectCharacters,
  saveReviewData,
} from "../reducer/main_reducer";
import { CharacterDataList, TranscriptedWord } from "../types";
import { Cookies } from "react-cookie";
import { PayloadAction } from "@reduxjs/toolkit";

const cookies = new Cookies();

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
    yield put(loadDataSuccess(characterList));
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
    console.log(characters);
    localStorage.setItem("characterData", JSON.stringify(characters));
    yield put(saveCharactersDataSuccess(characters));
  } catch (Error) {
    yield put(saveCharactersDataFailure("Error Message"));
  }
}

function* saveReviewDataWorker(
  action: PayloadAction<{
    toIncrease: Array<string>;
    toRedo: Array<string>;
  }>
) {
  try {
    // Wait minimum 500 ms
    yield new Promise((resolve) => setTimeout(resolve, 500));
    // Get the data and clean it
    const _characters: CharacterDataList = yield select(selectCharacters);
    const characters: CharacterDataList = JSON.parse(
      JSON.stringify(_characters)
    );

    // Get the payload data
    const toIncrease = action.payload.toIncrease;
    const toRedo = action.payload.toRedo;

    [...toIncrease, ...toRedo].forEach((key) => {
      const character = characters[key as keyof typeof characters];
      if (toIncrease.includes(key)) {
        character.reviewDelay *= 2;
      }
      const newReviewDate = new Date(
        new Date().getTime() + character.reviewDelay * 60000
      );
      character.reviewDate = newReviewDate.toString();
    });

    cookies.set("characterData", characters, { maxAge: 10000000 });
    yield put(saveCharactersDataSuccess(characters));
  } catch (Error) {
    yield put(saveCharactersDataFailure("Error Message"));
  }
}

export function* mainSaga() {
  yield takeLatest(loadData.type, loadDataWorker);
  yield takeLatest(saveTypeData.type, saveTypeDataWorker);
  yield takeLatest(saveReviewData.type, saveReviewDataWorker);
}
