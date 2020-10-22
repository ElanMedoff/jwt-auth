import "@babel/polyfill";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useGlobalState from "client/hooks/useGlobalState";
import GlobalStateContext from "client/contexts/globalStateContext";
import Home from "client/components/Home";
import Nav from "client/components/Nav";
import Account from "client/components/Account";
import PrivateRoute from "client/components/PrivateRoute";
import Loading from "client/components/Loading";
// Order of imports matter for global css!
import "client/scss/normalize.scss";
import "client/scss/resets.scss";
import "client/scss/utilities.scss";
import "client/scss/_include-media.scss";
import "client/components/shared.scss";
import "./index.scss";

function NoMatch() {
  return <div>ERROR 404</div>;
}

function App() {
  const globalState = useGlobalState();

  // Redux equivalent of received actions, setting globalState on-load
  useEffect(() => {
    async function fetchAccessToken() {
      const res = await fetch("http://localhost:3000/api/auth/accessToken");
      const data = await res.json();
      if (res.status === 202) {
        globalState.setAccessToken(data.accessToken);
      } else {
        console.info("Fetching accessToken on-load —", data);
      }
    }

    async function fetchRefreshTokenTime() {
      const res = await fetch("http://localhost:3000/api/auth/isLoggedIn");
      const data = await res.json();
      globalState.setIsLoggedIn(data.isLoggedIn);
      console.info("Fetching isLoggedIn on-load —", data.message);
    }

    globalState.setIsSourceReady(false);
    Promise.all([fetchRefreshTokenTime(), fetchAccessToken()]).then(() => {
      globalState.setIsSourceReady(true);
    });
  }, []);

  return (
    <GlobalStateContext.Provider value={globalState}>
      <Router>
        {/* Loading contains all the logic for when to appear */}
        <Loading />
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <PrivateRoute path="/account" redirect="/">
            <Account />
          </PrivateRoute>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </GlobalStateContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
