import React, { Fragment, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import GlobalStateContext from "client/contexts/globalStateContext";
import Countdown from "react-countdown";
import "./Nav.scss";
import "client/components/shared.scss";

export default function Nav() {
  const globalState = useContext(GlobalStateContext);
  const [refreshTokenTime, setRefreshTokenTime] = useState(0);
  const [accessTokenTime, setAccessTokenTime] = useState(0);

  useEffect(() => {
    if (globalState && globalState.accessToken) {
      setAccessTokenTime(
        jwt.decode(globalState.accessToken).exp * 1000 - Date.now()
      );
    }
  }, [globalState.accessToken]);

  useEffect(() => {
    async function fetchRefreshTokenTime() {
      globalState.setIsLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/isLoggedIn");
      const data = await res.json();
      globalState.setIsLoggedIn(data.isLoggedIn);
      globalState.setIsLoading(false);

      setRefreshTokenTime(data.remainingTime - Date.now());

      console.log(res.status, data);
    }

    fetchRefreshTokenTime();
  }, [globalState.isLoggedIn]);

  async function onLogout(e) {
    e.preventDefault();

    globalState.setIsLoading(true);
    const res = await fetch("http://localhost:3000/api/auth/logout");
    const data = await res.json();

    globalState.setIsLoggedIn(false);
    globalState.setIsLoading(false);

    console.log(res.status, data);
  }

  return (
    <Fragment>
      <div className="flex-row justify-center width-100">
        <div className="nav-container">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
      <div className="countdown-timers">
        <div className="countdown-timer-container">
          <span>Access Token Remaining Time:</span>
          <Countdown date={Date.now() + accessTokenTime} />
        </div>
        <div className="countdown-timer-container">
          <span>Refresh Token Remaining Time:</span>
          <Countdown date={Date.now() + refreshTokenTime} />
        </div>
        <div className="access-token-container">
          <div>Access token:</div>
          <span className="access-token">{globalState.accessToken}</span>
        </div>
      </div>
    </Fragment>
  );
}
