import React, { useState, useContext } from "react";
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

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);

  async function onLogin(e) {
    e.preventDefault();
    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/login",
      {
        username: loginUsername,
        password: loginPassword,
      },
      [globalState, dispatch]
    );

    const data = await res.json();

    if (res.status !== 202) {
      console.error(res.status, data);
      setIsLoginError(true);

      globalStateSetIsLoggedIn(dispatch, { isLoggedIn: false });
      globalStateSetIsLoading(dispatch, { isLoading: false });
      return;
    }

    globalStateSetAccessToken(dispatch, { accessToken: data.accessToken });
    globalStateSetIsLoggedIn(dispatch, { isLoggedIn: true });
    globalStateSetIsLoading(dispatch, { isLoading: false });
  }

  return (
    <div className="form-container">
      <form>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        {isLoginError && <div>LOGIN ERROR</div>}
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => onLogin(e)}>
          Login
        </button>
        {/* {`<a href="${signupPassword}">${username}</a>`} */}
      </form>
    </div>
  );
}
