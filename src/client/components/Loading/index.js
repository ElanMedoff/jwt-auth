import React, { useContext } from "react";
import Loader from "react-loader-spinner";
import classNames from "classnames";
import GlobalStateContext from "client/contexts/globalStateContext";
import styles from "./Loading.module.scss";

export default function Loading() {
  const globalState = useContext(GlobalStateContext);

  return (
    <div
      className={classNames(
        styles.spinnerContainer,
        globalState.isReady
          ? styles.spinnerContainerClosed
          : styles.spinnerContainerOpen
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
