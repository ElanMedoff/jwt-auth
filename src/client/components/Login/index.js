import React, { useState, useContext, useEffect } from "react";
import classNames from "classnames";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";
import "client/components/shared.scss";

export default function Login() {
  const globalState = useContext(GlobalStateContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  let isSubscribed = true;

  //TODO this seems wrong
  useEffect(() => {
    setUsername("");
    setPassword("");

    return () => {
      isSubscribed = false;
    };
  }, [globalState.setIsLoggedIn]);

  async function onLogin(e) {
    e.preventDefault();

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

    // console.log(isSubscribed);
    // if (!isSubscribed) return;

    if (res.status !== 202) {
      console.error(res.status, data);
      setIsInputError(true);
      setInputErrorMessage(data.message);

      globalState.setIsLoggedIn(false);
      globalState.setIsLoading(false);
      return;
    }

    globalState.setAccessToken(data.accessToken);
    globalState.setIsLoggedIn(true);
    globalState.setIsLoading(false);
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
