import React, { useContext } from "react";
import classNames from "classnames";
import { BiShow, BiHide } from "react-icons/bi";
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
    showPassword,
    setShowPassword,
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
        <div className="password-container">
          <input
            className="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={(e) => {
              setIsInputError(false);
              setPassword(e.target.value);
            }}
          />
          <div
            className="password-icon"
            onClick={
              showPassword
                ? () => setShowPassword(false)
                : () => setShowPassword(true)
            }
          >
            {showPassword ? <BiShow /> : <BiHide />}
          </div>
        </div>

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
