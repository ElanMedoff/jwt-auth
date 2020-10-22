import React, { Fragment, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import GlobalStateContext from "client/contexts/globalStateContext";
import Countdown from "react-countdown";
import styles from "./Nav.module.scss";

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
      globalState.setIsNavReady(false);
      const res = await fetch(
        "http://localhost:3000/api/auth/refreshTokenRemainingTime"
      );
      const data = await res.json();
      globalState.setIsNavReady(true);
      setRefreshTokenTime(data.remainingTime - Date.now());
      console.info("Fetching refresh token remaining time", res.status, data);
    }

    if (globalState.isLoggedIn) {
      fetchRefreshTokenTime();
    } else {
      setRefreshTokenTime(0);
    }
  }, [globalState.isLoggedIn]);

  async function onLogout(e) {
    e.preventDefault();

    globalState.setIsNavReady(false);
    const res = await fetch("http://localhost:3000/api/auth/logout");
    const data = await res.json();

    globalState.setIsLoggedIn(false);
    globalState.setIsNavReady(true);

    console.info("Logout", res.status, data);
  }

  return (
    <Fragment>
      <div className="flex-row justify-center width-100">
        <div className={styles.navContainer}>
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
      <div className={styles.countdownTimers}>
        <div className={styles.countdownTimerContainer}>
          <span>Access Token Remaining Time:</span>
          <Countdown date={Date.now() + accessTokenTime} />
        </div>
        <div className={styles.countdownTimerContainer}>
          <span>Refresh Token Remaining Time:</span>
          <Countdown date={Date.now() + refreshTokenTime} />
        </div>
        <div className={styles.accessTokenContainer}>
          <div>Access token:</div>
          <span className={styles.accessToken}>{globalState.accessToken}</span>
        </div>
      </div>
    </Fragment>
  );
}
