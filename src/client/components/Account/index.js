import React, { useState, useEffect, useContext } from "react";
import GlobalStateContext from "client/contexts/globalStateContext";
import myFetch from "client/utilities/myFetch";
import styles from "./Account.module.scss";

export default function Account() {
  const globalState = useContext(GlobalStateContext);
  const [data, setData] = useState();

  useEffect(() => {
    async function getAccountInfo() {
      globalState.setIsAccountReady(false);
      const res = await myFetch(
        "GET",
        "http://localhost:3000/api/account",
        null,
        globalState
      );
      const resData = await res.json();
      globalState.setIsAccountReady(true);
      setData(resData.username);
    }

    if (globalState.accessToken) {
      getAccountInfo();
    }
  }, [globalState.accessToken]);

  return (
    <div className={styles.dataContainer}>
      <div className={styles.data}>
        {data &&
          `Hello — ${data} — your name has been fetched from the backend only because you are currently authenticated. This information would not be fetchable for anyone else.`}
      </div>
    </div>
  );
}
