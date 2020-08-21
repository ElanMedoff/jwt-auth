import React, { useState, useEffect, useContext } from "react";
import AccessTokenContext from "client/contexts/accessTokenContext";
import myFetch from "client/utilities/myFetch";
import "./Home.scss";

export default function Home() {
  const [accessToken, setAccessToken] = useContext(AccessTokenContext);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSignupError, setIsSignupError] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  useEffect(() => {
    async function fetchAccessToken() {
      const res = await fetch("http://localhost:3000/api/auth/accessToken");
      const data = await res.json();
      if (res.status === 202) {
        setAccessToken(data.accessToken);
      } else {
        console.warn(data, "Normal behavior if occurring on-reload");
      }
    }

    fetchAccessToken();
  }, []);

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

  async function getCat(e) {
    e.preventDefault();

    const res = await myFetch(
      "GET",
      "http://localhost:3000/api/cat",
      null,
      accessToken
    );
    const data = await res.json();

    console.log(data, res.status);
  }

  // TODO add in error fields, clean up this form
  return (
    <>
      accessToken:
      {accessToken}
      <form>
        Signup
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setSignupUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="signupPassword"
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => onSignup(e)}>
          Signup
        </button>
      </form>
      <br />
      <br />
      <form>
        Login
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
      <button onClick={getCat}>CAT</button>
    </>
  );
}
