import React, { useContext } from "react";
import classNames from "classnames";
import { BiShow, BiHide } from "react-icons/bi";
import useForm from "client/hooks/useForm";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";

export default function Signup() {
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

  async function onSignup(e) {
    e.preventDefault();
    globalState.setIsSignupReady(false);
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
    globalState.setIsSignupReady(true);

    if (res.status !== 201) {
      console.error("Attempted signup", res.status, data.message);
      setIsInputError(true);
      setInputErrorMessage(data.message);
      return;
    }
    console.info("Signup", res.status, data);
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
