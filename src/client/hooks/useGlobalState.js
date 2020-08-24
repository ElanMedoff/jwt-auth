import { useState } from "react";

export default function useGlobalState() {
  const [accessToken, setAccessToken] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return {
    accessToken,
    setAccessToken,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
  };
}
