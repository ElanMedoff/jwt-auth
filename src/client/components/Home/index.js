import React, { Fragment, useEffect, useContext } from "react";
import GlobalStateContext from "client/contexts/globalStateContext";
import {
  globalStateSetIsLoading,
  globalStateSetIsLoggedIn,
  globalStateSetAccessToken,
} from "client/utilities/actionCreators";
import myFetch from "client/utilities/myFetch";
import Login from "client/components/Login";
import Signup from "client/components/Signup";
import "./Home.scss";

export default function Home() {
  const [globalState, dispatch] = useContext(GlobalStateContext);

  useEffect(() => {
    async function checkIsLoggedIn() {
      globalStateSetIsLoading(dispatch, { isLoading: true });
      const res = await fetch("http://localhost:3000/api/auth/isLoggedIn");
      const data = await res.json();
      console.log(res.status, data.message, data.isLoggedIn);
      globalStateSetIsLoggedIn(dispatch, {
        isLoggedIn: data.isLoggedIn,
      });
    }

    checkIsLoggedIn().then(() =>
      globalStateSetIsLoading(dispatch, { isLoading: false })
    );
  }, []);

  useEffect(() => {
    async function fetchAccessToken() {
      globalStateSetIsLoading(dispatch, { isLoading: true });
      const res = await fetch("http://localhost:3000/api/auth/accessToken");
      const data = await res.json();
      if (res.status === 202) {
        globalStateSetAccessToken(dispatch, { accessToken: data.accessToken });
      } else {
        console.warn(data, "Normal behavior if occurring on-reload");
      }
    }

    fetchAccessToken().then(() => {
      globalStateSetIsLoading(dispatch, { isLoading: false });
    });
  }, []);

  async function getCat(e) {
    e.preventDefault();

    const res = await myFetch("GET", "http://localhost:3000/api/cat", null, [
      globalState,
      dispatch,
    ]);
    const data = await res.json();
    console.log(data, res.status);
  }

  return (
    <div>
      {globalState.accessToken}
      {/* TODO figure out a better spinner */}
      {globalState.isLoading && <div>LOADING</div>}
      <div className="home-container">
        {globalState.isLoggedIn ? null : (
          <Fragment>
            <Login />
            <Signup />
          </Fragment>
        )}
      </div>
    </div>
  );
}
