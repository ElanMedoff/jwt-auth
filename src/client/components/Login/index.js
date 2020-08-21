import React, { Fragment, useState, useContext } from "react";
import myFetch from "client/utilities/myFetch";
import AccessTokenContext from "client/contexts/accessTokenContext";
import "../shared.scss";

export default function Login() {
  const [accessToken, setAccessToken] = useContext(AccessTokenContext);

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
      accessToken
    );

    const data = await res.json();

    if (res.status !== 202) {
      console.error(res.status, data);
      setIsLoginError(true);
      return;
    }
    setAccessToken(data.accessToken);
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
