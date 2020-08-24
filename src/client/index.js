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
import "client/scss/_normalize.scss";
import "client/scss/_resets.scss";
import "client/scss/_utilities.scss";
import "./index.scss";

function NoMatch() {
  return <div>ERROR 404</div>;
}

function App() {
  const globalState = useGlobalState();

  // Check isLoggedIn is handled in the Nav comp

  useEffect(() => {
    async function fetchAccessToken() {
      globalState.setIsLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/accessToken");
      const data = await res.json();
      if (res.status === 202) {
        globalState.setAccessToken(data.accessToken);
      } else {
        console.warn(data, "Normal behavior if occurring on-reload");
      }
      globalState.setIsLoading(false);
    }

    fetchAccessToken();
  }, []);

  return (
    <GlobalStateContext.Provider value={globalState}>
      <Router>
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
