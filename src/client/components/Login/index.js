import React, { useState, useContext } from "react";
import classNames from "classnames";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";
import {
  globalStateSetIsLoading,
  globalStateSetIsLoggedIn,
  globalStateSetAccessToken,
} from "client/utilities/actionCreators";
import "client/components/shared.scss";

export default function Login() {
  const [globalState, dispatch] = useContext(GlobalStateContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  async function onLogin(e) {
    e.preventDefault();
    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/login",
      {
        username,
        password,
      },
      [globalState, dispatch]
    );

    const data = await res.json();

    if (res.status !== 202) {
      console.error(res.status, data);
      setIsInputError(true);
      setInputErrorMessage(data.message);

      globalStateSetIsLoggedIn(dispatch, { isLoggedIn: false });
      globalStateSetIsLoading(dispatch, { isLoading: false });
      return;
    }

    globalStateSetAccessToken(dispatch, { accessToken: data.accessToken });
    globalStateSetIsLoggedIn(dispatch, { isLoggedIn: true });
    globalStateSetIsLoading(dispatch, { isLoading: false });
    setUsername("");
    setPassword("");
  }

  return (
    <div className="form-container">
      <form className="relative">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => {
            setIsInputError(false);
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setIsInputError(false);
            setPassword(e.target.value);
          }}
        />
        <button type="submit" onClick={(e) => onLogin(e)}>
          Login
        </button>
        <div
          className={classNames(
            "input-error",
            isInputError ? "input-error-open" : "input-error-closed"
          )}
        >
          {isInputError && inputErrorMessage}
        </div>

        {/* {`<a href="${signupPassword}">${username}</a>`} */}
      </form>
    </div>
  );
}
