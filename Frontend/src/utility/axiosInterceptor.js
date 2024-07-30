/* eslint-disable */
import axios from "axios";
import { persistor } from "../redux/store";
const SERVER_URL = import.meta.env.VITE_APP_DEVELOPMENT_API_BASE_URL;
let apiCall = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "X-Custom-Header": "foobar",
  },
});

apiCall.interceptors.request.use(
  function (req) {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers = {
        ...req.headers,
        token,
      };
    }
    return req;
  },
  (err) => {
    console.log("err", err);
    return Promise.reject(err);
  }
);

apiCall.interceptors.response.use(
  async (resp) => {
    if (
      resp?.data?.msg === "invalid token or expired token" ||
      resp?.data?.expired == true
    ) {
      localStorage.clear();
      window.localStorage.removeItem("persist:root");
      persistor.pause();
      window.location.href = "/signin";
    }
    if (resp?.data?.token) {
      const token = resp?.data?.token;
      localStorage.setItem("token", token);
      return resp;
    }
    if (resp?.data) {
      return resp.data;
    }

    return resp;
  },
  (err) => {
    console.log("err", err);
    return Promise.reject(err);
  }
);

export default apiCall;
