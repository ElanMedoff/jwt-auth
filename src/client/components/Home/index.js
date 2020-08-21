import React, { useState, useEffect, useContext } from "react";
import AccessTokenContext from "client/contexts/accessTokenContext";
import myFetch from "client/utilities/myFetch";
import Login from "client/components/Login";
import Signup from "client/components/Signup";
import "./Home.scss";

export default function Home() {
  const [accessToken, setAccessToken] = useContext(AccessTokenContext);

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

  return (
    <div className="home-container">
      {accessToken}
      <Login />
      <Signup />
      <button type="button" onClick={getCat}>
        CAT
      </button>
    </div>
  );
}
