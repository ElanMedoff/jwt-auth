export default function myFetch(method, url, data, accessToken) {
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
