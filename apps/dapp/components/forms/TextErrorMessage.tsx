import React from "react";
import { Text } from "@chakra-ui/react";

type TypeErrorMessage = {
  key: string;
  values: object;
};

export const TextErrorMessage = ({
  error,
}: {
  error: TypeErrorMessage | string;
}): JSX.Element | null => {
  let message;

  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error.key && error.values) {
    message = error.key;
  }

  if (!message || message.trim().length === 0) return null;

  // make sure first character is upper case
  message = message.charAt(0).toUpperCase() + message.slice(1);

  return (
    <Text pb="4" color="openar.error">
      {message}
    </Text>
  );
};

export default TextErrorMessage;
