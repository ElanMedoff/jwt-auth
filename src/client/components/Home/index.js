import React, { useState } from "react";
import "./Home.scss";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    console.log({ username, password });
  }

  return (
    <form>
      <input
        type="text"
        placeholder="text"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="link"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" onClick={(e) => onSubmit(e)}>
        Login
      </button>
      {`<a href="${password}">${username}</a>`}
    </form>
  );
}
