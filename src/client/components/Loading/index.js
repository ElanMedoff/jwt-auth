import React, { useContext } from "react";
import Loader from "react-loader-spinner";
import classNames from "classnames";
import GlobalStateContext from "client/contexts/globalStateContext";
import styles from "./Loading.module.scss";

export default function Loading() {
  console.log("Loading is rendering!");
  const globalState = useContext(GlobalStateContext);

  return (
    <div
      className={classNames(
        styles.spinnerContainer,
        globalState.isLoading
          ? styles.spinnerContainerOpen
          : styles.spinnerContainerClosed
      )}
    >
      <div className={styles.spinner}>
        <Loader
          type="Oval"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={60000}
        />
      </div>
    </div>
  );
}
