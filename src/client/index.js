import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useAccessToken from "client/hooks/useAccessToken";
import AccessTokenContext from "client/contexts/accessTokenContext";
import Home from "client/components/Home";
import Nav from "client/components/Nav";
import Cat from "client/components/Cat";
import "client/scss/_normalize.scss";
import "client/scss/_resets.scss";
import "client/scss/_utilities.scss";
import "./index.scss";

function NoMatch() {
  return <div>ERROR 404</div>;
}

function App() {
  const accessToken = useAccessToken();
  return (
    <AccessTokenContext.Provider value={accessToken}>
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/cat">
            <Cat />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </AccessTokenContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
