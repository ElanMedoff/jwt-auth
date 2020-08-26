import { useState } from "react";

// TODO add a field that changes from visible to hidden
// TODO make mobile responsive
export default function useForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  return {
    username,
    setUsername,
    password,
    setPassword,
    isInputError,
    setIsInputError,
    inputErrorMessage,
    setInputErrorMessage,
  };
}
