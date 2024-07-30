import actions from "./actions";

const initialState = {
  users: [],
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: null,
  isLoading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
