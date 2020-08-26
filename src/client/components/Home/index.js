import React, { Fragment, useContext } from "react";
import { Redirect } from "react-router-dom";
import GlobalStateContext from "client/contexts/globalStateContext";
import Login from "client/components/Login";
import Signup from "client/components/Signup";
import styles from "./Home.module.scss";

export default function Home() {
  const globalState = useContext(GlobalStateContext);

  return (
    <div>
      <div className={styles.homeContainer}>
        {globalState.isLoggedIn ? (
          <Redirect to="/account" />
        ) : (
          <Fragment>
            <Login />
            <Signup />
          </Fragment>
        )}
      </div>
    </div>
  );
}
