export function globalStateSetIsLoggedIn(dispatch, payload) {
  dispatch({
    type: "SET_IS_LOGGED_IN",
    payload,
  });
}

export function globalStateSetIsLoading(dispatch, payload) {
  dispatch({
    type: "SET_IS_LOADING",
    payload,
  });
}

export function globalStateSetAccessToken(dispatch, payload) {
  dispatch({
    type: "SET_ACCESS_TOKEN",
    payload,
  });
}
