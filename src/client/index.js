import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "client/components/Home";
import Nav from "client/components/Nav";
import Cat from "client/components/Cat";
import NoMatch from "client/components/NoMatch";
import "client/scss/_normalize.scss";
import "client/scss/_resets.scss";
import "client/scss/_utilities.scss";
import "./index.scss";

function App() {
  return (
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
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
