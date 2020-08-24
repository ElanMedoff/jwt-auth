import React, { useState, useEffect, useContext } from "react";
import GlobalStateContext from "client/contexts/globalStateContext";
import myFetch from "client/utilities/myFetch";

export default function Account() {
  const globalState = useContext(GlobalStateContext);
  const [data, setData] = useState();

  useEffect(() => {
    async function getAccountInfo() {
      const res = await myFetch(
        "GET",
        "http://localhost:3000/api/account",
        null,
        globalState
      );
      const resData = await res.json();

      globalState.setIsLoading(false);
      setData(resData.username);

      console.log(resData, res.status);
    }

    if (!globalState.isLoading) {
      getAccountInfo();
    }
  }, []);

  return <div>{data}</div>;
}
