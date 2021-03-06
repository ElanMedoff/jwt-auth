import jwt from "jsonwebtoken";

export default async function myFetch(method, url, data, globalState) {
  let { accessToken } = globalState;

  // Before any call is made, check if the access token is expired, and if it is, get a new access token
  if (accessToken && jwt.decode(accessToken)) {
    const expiry = jwt.decode(accessToken).exp;
    const now = new Date();
    if (now.getTime() > expiry * 1000) {
      const res = await fetch("http://localhost:3000/api/auth/accessToken");
      const resData = await res.json();
      globalState.setAccessToken(resData.accessToken);

      // Kinda like optimistic updating, allows us to make the call without relying on setAccessToken to behave synch
      accessToken = resData.accessToken;
    }
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (accessToken) {
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
  }

  const myInit = {
    method,
    headers: myHeaders,
    mode: "same-origin",
    cache: "default",
    body: data ? JSON.stringify(data) : undefined,
  };

  return fetch(url, myInit);
}
