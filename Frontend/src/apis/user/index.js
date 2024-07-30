import apiCall from "../../utility/axiosInterceptor";

export const getUserAPI = async () => {
  // return await apiCall.post('/users', payload)
  return await apiCall.post(`/user/get?`);
};
export const loginAPI = async (payload) => {
  return await apiCall.post("/user/login", payload);
};
export const createUserAPI = async (payload) => {
  console.info("-------------------------------");
  console.info("payload => ", payload);
  console.info("-------------------------------");
  return await apiCall.post("/user/create", payload);
};
