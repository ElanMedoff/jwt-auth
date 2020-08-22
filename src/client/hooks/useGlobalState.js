import { useReducer } from "react";

export default function useGlobalState() {
  // eslint-disable-next-line consistent-return
  function reducer(state, action) {
    switch (action.type) {
      case "SET_IS_LOADING":
        return {
          ...state,
          isLoading: action.payload.isLoading,
        };
      case "SET_IS_LOGGED_IN":
        return {
          ...state,
          isLoggedIn: action.payload.isLoggedIn,
        };
      case "SET_ACCESS_TOKEN":
        return {
          ...state,
          accessToken: action.payload.accessToken,
        };
      default:
        throw new Error("Action type not valid!");
    }
  }

  const initialState = {
    accessToken: "",
    isLoading: true,
    isLoggedIn: false,
  };

  return useReducer(reducer, initialState);
}
