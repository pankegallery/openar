import React from "react";
import { FormErrorMessage } from "@chakra-ui/react";
type TypeErrorMessage = {
  key: string;
  values: object;
};

export const FieldErrorMessage = ({
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

  if (!message || message.trim().length === 0) return <></>;

  // make sure first character is uppder case
  message = message.charAt(0).toUpperCase() + message.slice(1);

  return <FormErrorMessage mt="0.5">{message}</FormErrorMessage>;
};

export default FieldErrorMessage;
