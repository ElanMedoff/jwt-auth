import React, { useState, useContext } from "react";
import myFetch from "client/utilities/myFetch";
import AccessTokenContext from "client/contexts/accessTokenContext";
import "../shared.scss";

export default function Signup() {
  const [accessToken, setAccessToken] = useContext(AccessTokenContext);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSignupError, setIsSignupError] = useState(false);

  async function onSignup(e) {
    e.preventDefault();
    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/signup",
      {
        username: signupUsername,
        password: signupPassword,
      },
      accessToken
    );
    const data = await res.json();

    if (res.status !== 201) {
      console.error(res.status, data);
      setIsSignupError(true);
      return;
    }
    console.log(res.status, data);
  }

  return (
    <div className="form-container">
      <form>
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setSignupUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => onSignup(e)}>
          Signup
        </button>
      </form>
    </div>
  );
}
