import React, { useContext } from "react";
import classNames from "classnames";
import useForm from "client/hooks/useForm";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";

export default function Login() {
  const globalState = useContext(GlobalStateContext);
  const {
    username,
    setUsername,
    password,
    setPassword,
    isInputError,
    setIsInputError,
    inputErrorMessage,
    setInputErrorMessage,
  } = useForm();

  async function onLogin(e) {
    e.preventDefault();
    globalState.setIsLoading(true);

    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/login",
      {
        username,
        password,
      },
      globalState
    );

    const data = await res.json();

    if (res.status !== 202) {
      console.error("Attempted login", res.status, data.message);
      setIsInputError(true);
      setInputErrorMessage(data.message);
      globalState.setIsLoggedIn(false);
      globalState.setIsLoading(false);
      return;
    }
    globalState.setAccessToken(data.accessToken);
    globalState.setIsLoggedIn(true);
    globalState.setIsLoading(false);

    if (globalState.isLoggedIn) {
      setUsername("");
      setPassword("");
    }
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
      </form>
    </div>
  );
}
