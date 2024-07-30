/*eslint-disable */
import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import { createUserAPI, getUserAPI, loginAPI } from "../../apis/user";
import {
  tostify,
  tostifyError,
  tostifySuccess,
} from "../../Components/Tostify";

export function* WATCH_GET_USER(action) {
  const resp = yield getUserAPI(action.payload);
  yield put({
    type: actions.SET_USER,
    payload: {
      users: resp,
    },
  });
}

export function* WATCH_SIGN_IN(action) {
  try {
    console.log("sagagag");
    const resp = yield loginAPI(action.payload);
    if (resp?.data?.token) {
      tostifySuccess("Successfully logged In");
      const token = resp?.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(resp?.data));
      yield put({
        type: actions.SET_USER,
        payload: {
          user: resp.data.user,
          token: resp.data.token,
        },
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      tostifyError(resp.msg ? resp.msg : "Somthing went Wrong");
    }
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
  }
}

export function* WATCH_CREATE_USER(action) {
  try {
    const data = yield createUserAPI(action.payload);
    if (data?.error) {
      yield tostifyError(data.error);
      return;
    }
    if (data?.msg) {
      yield tostify(data.msg);
    }

    if (data?.data?.id) {
      yield tostifySuccess("User Created Successfully");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    }
  } catch (error) {
    console.error("Error in WATCH_CREATE_USER:", error);
    yield tostifyError("Failed to create user");
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_USER, WATCH_CREATE_USER),
    takeEvery(actions.GET_USER, WATCH_GET_USER),
    takeEvery(actions.SIGN_IN, WATCH_SIGN_IN),
  ]);
}
