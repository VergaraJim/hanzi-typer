import { all } from "redux-saga/effects";
import { mainSaga } from "./main_saga";

export default function* rootSaga() {
  yield all([mainSaga()]);
}
