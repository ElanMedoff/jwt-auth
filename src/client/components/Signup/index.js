import React, { useState, useContext } from "react";
import myFetch from "client/utilities/myFetch";
import GlobalStateContext from "client/contexts/globalStateContext";
import { globalStateSetIsLoading } from "client/utilities/actionCreators";
import "client/components/shared.scss";

export default function Signup() {
  const [globalState, dispatch] = useContext(GlobalStateContext);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // TODO make this into a custom hook where is will show a red box, useInputError
  const [isSignupError, setIsSignupError] = useState(false);

  async function onSignup(e) {
    e.preventDefault();
    const res = await myFetch(
      "POST",
      "http://localhost:3000/api/auth/signup",
      {
        username: signupUsername,
        password: signupPassword,
      },
      [globalState, dispatch]
    );
    const data = await res.json();
    globalStateSetIsLoading(dispatch, { isLoading: false });

    if (res.status !== 201) {
      console.error(res.status, data);
      setIsSignupError(true);
      return;
    }
    console.log(res.status, data);
  }

  return (
    <div className="form-container">
      <form>
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setSignupUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => onSignup(e)}>
          Signup
        </button>
      </form>
    </div>
  );
}
