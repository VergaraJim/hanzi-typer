import { put, select, takeLatest } from "redux-saga/effects";
import {
  loadData,
  loadDataFailure,
  loadDataSuccess,
  saveTypeData,
  saveTypeDataFailure,
  saveTypeDataSuccess,
  selectCharacters,
} from "../reducer/main_reducer";
import { CharacterDataList, TranscriptedCharacter } from "../types";
import { Cookies } from "react-cookie";
import { PayloadAction } from "@reduxjs/toolkit";

const cookies = new Cookies();

function* loadDataWorker() {
  try {
    let characterList: CharacterDataList = {};
    let data: Object | null = cookies.get("characterData");
    // Check if it's null
    if (!data) {
      // No data, set it to empty;
      data = {};
      cookies.set("characterData", data);
    }
    characterList = data as CharacterDataList;
    yield put(loadDataSuccess(characterList));
  } catch (error) {
    yield put(loadDataFailure("Error Message"));
  }
}

function* saveTypeDataWorker(
  action: PayloadAction<Array<TranscriptedCharacter>>
) {
  try {
    // Wait minimum 500 ms
    yield new Promise((resolve) => setTimeout(resolve, 500));
    // Get the data and clean it
    const _characters: CharacterDataList = yield select(selectCharacters);
    const characters = JSON.parse(JSON.stringify(_characters));

    // Cycle the tanscript to get new data to add
    const transcripted = action.payload;
    transcripted.forEach((transcript) => {
      if (!Object.keys(characters).includes(transcript.character)) {
        // If it's not in the list, create it
        characters[transcript.character] = {
          tries: 0,
          correct: 0,
          wrong: 0,
          reviewDate: new Date().toString(),
          reviewDelay: 10,
        };
      }
      characters[transcript.character].tries += 1;
      if (transcript.guessed) {
        characters[transcript.character].correct += 1;
      } else {
        if (characters[transcript.character].reviewDelay / 2 > 0) {
          characters[transcript.character].reviewDelay =
            characters[transcript.character].reviewDelay / 2;
          characters[transcript.character].reviewDate = new Date().toString();
        }
        characters[transcript.character].wrong += 1;
      }
    });
    cookies.set("characterData", characters, { maxAge: 10000000 });
    yield put(saveTypeDataSuccess(characters));
  } catch (Error) {
    yield put(saveTypeDataFailure("Error Message"));
  }
}

export function* mainSaga() {
  yield takeLatest(loadData.type, loadDataWorker);
  yield takeLatest(saveTypeData.type, saveTypeDataWorker);
}
