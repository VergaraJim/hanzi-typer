import { put, takeLatest } from "redux-saga/effects";
import {
  loadData,
  loadDataFailure,
  loadDataSuccess,
} from "../reducer/main_reducer";
import { CharacterDataList } from "../types";
import { Cookies } from "react-cookie";

function* loadDataWorker() {
  const cookies = new Cookies();
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

export function* mainSaga() {
  yield takeLatest(loadData.type, loadDataWorker);
}
