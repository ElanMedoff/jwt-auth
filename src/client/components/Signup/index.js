import React, { useState, useContext } from "react";
import classNames from "classnames";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";
import "client/components/shared.scss";

export default function Signup() {
  const globalState = useContext(GlobalStateContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  async function onSignup(e) {
    e.preventDefault();
    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/signup",
      {
        username,
        password,
      },
      globalState
    );
    const data = await res.json();
    globalState.setIsLoading(false);

    if (res.status !== 201) {
      console.error(res.status, data);
      setIsInputError(true);
      setInputErrorMessage(data.message);
      return;
    }
    console.log(res.status, data);
    setUsername("");
    setPassword("");
  }

  return (
    <div className="form-container">
      <form className="relative">
        <h1>Signup</h1>
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
        <button type="submit" onClick={(e) => onSignup(e)}>
          Signup
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
