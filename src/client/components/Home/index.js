import React, { useState, useEffect } from "react";
import "./Home.scss";

export default function Home() {
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSignupError, setIsSignupError] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function fetchAccessToken() {
      const res = await fetch("http://localhost:3000/api/accessToken");
      const data = await res.json();
      if (res.status === 202) {
        setAccessToken(data.accessToken);
      } else {
        console.warn(data, "Normal behavior if occurring on-reload");
      }
    }

    fetchAccessToken();
  }, []);

  function myFetch(method, url, data) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (accessToken) {
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    const myInit = {
      method: method,
      headers: myHeaders,
      mode: "same-origin",
      cache: "default",
      body: data ? JSON.stringify(data) : undefined,
    };

    return fetch(url, myInit);
  }

  async function onSignup(e) {
    e.preventDefault();
    const res = await myFetch("POST", "http://localhost:3000/api/signup", {
      username: signupUsername,
      password: signupPassword,
    });
    if (res.status !== 201) {
      setIsSignupError(true);
    }
  }

  async function onLogin(e) {
    e.preventDefault();

    const res = await myFetch("POST", "http://localhost:3000/api/login", {
      username: loginUsername,
      password: loginPassword,
    });

    if (res.status !== 202) {
      setIsLoginError(true);
      return;
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
  }

  async function getCat(e) {
    e.preventDefault();

    const res = await myFetch("GET", "http://localhost:3000/api/cat");
    const data = await res.json();

    console.log(data, res.status);
  }

  //TODO add in error fields, clean up this form
  return (
    <>
      accessToken: {accessToken}
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
