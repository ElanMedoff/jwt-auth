import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import propTypes from "prop-types";
import GlobalStateContext from "client/contexts/globalStateContext";

export default function PrivateRoute({ children, path, redirect }) {
  const globalState = useContext(GlobalStateContext);

  if (globalState.isLoggedIn) {
    return <Route path={path}>{children}</Route>;
  }
  return <Redirect to={redirect} />;
}

PrivateRoute.propTypes = {
  children: propTypes.element.isRequired,
  path: propTypes.string.isRequired,
  redirect: propTypes.string.isRequired,
};
