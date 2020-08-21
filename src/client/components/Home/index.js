import React, { useState, useEffect } from "react";
import "./Home.scss";

export default function Home() {
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/accessToken")
      .then((res) => {
        // TODO this pattern looks rough
        if (res.status === 202) return res.json();
        throw new Error(`Status: ${res.status}`);
      })
      .then((res) => setAccessToken(res.accessToken));
  }, []);

  function myPost(url, data) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (accessToken) {
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    const myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "same-origin",
      cache: "default",
      body: JSON.stringify(data),
    };

    return fetch(url, myInit);
  }

  function onSignup(e) {
    e.preventDefault();
    myPost("http://localhost:3000/api/signup", {
      username: signupUsername,
      password: signupPassword,
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  }

  function onLogin(e) {
    e.preventDefault();
    myPost("http://localhost:3000/api/login", {
      username: loginUsername,
      password: loginPassword,
    })
      .then((res) => {
        if (res.status === 202) return res.json();
        throw new Error("Bad login!");
      })
      .then((res) => setAccessToken(res.accessToken))
      .catch((e) => console.error(e));
  }

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
    </>
  );
}
