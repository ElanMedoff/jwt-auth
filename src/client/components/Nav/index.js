import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GlobalStateContext from "client/contexts/globalStateContext";
import {
  globalStateSetIsLoading,
  globalStateSetIsLoggedIn,
} from "client/utilities/actionCreators";
import "./Nav.scss";
import "client/components/shared.scss";

export default function Nav() {
  const [, dispatch] = useContext(GlobalStateContext);

  async function onLogout(e) {
    e.preventDefault();

    globalStateSetIsLoading(dispatch, { isLoading: true });
    const res = await fetch("http://localhost:3000/api/auth/logout");
    const data = await res.json();
    console.log(res.status, data);

    globalStateSetIsLoggedIn(dispatch, { isLoggedIn: false });
    globalStateSetIsLoading(dispatch, { isLoading: false });
  }

  return (
    <div className="flex-row justify-center width-100">
      <div className="nav-container">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cat">Cat</Link>
          </li>
        </ul>
        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
