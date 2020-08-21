import React from "react";
import { Link } from "react-router-dom";
import "./Nav.scss";
import "../shared.scss";

export default function Nav() {
  async function onSignout(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/auth/logout");
    const data = await res.json();
    console.log(res.status, data);
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
        <button type="button" onClick={onSignout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
