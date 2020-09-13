import { useState } from "react";

export default function useForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  return {
    username,
    setUsername,
    password,
    setPassword,
    isInputError,
    setIsInputError,
    inputErrorMessage,
    setInputErrorMessage,
    showPassword,
    setShowPassword,
  };
}
