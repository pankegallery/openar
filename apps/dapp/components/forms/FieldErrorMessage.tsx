import React from "react";
import { FormErrorMessage, FormErrorIcon } from "@chakra-ui/react";
type TypeErrorMessage = {
  key: string;
  values: object;
};

import { RiAlertFill } from "react-icons/hi";


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

  return <>
      <FormErrorIcon
        icon={<RiAlertFill />}
        mr="2"
        color="openar.error"
        fontSize="xs"/>
      <FormErrorMessage
            mt="0"
            color="openar.error"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="0.02em"
            fontWeight="700"
            color="openar.error"
            display="inline-block"
            errorIcon='alert'
         >{message}</FormErrorMessage>
    </>;
};

export default FieldErrorMessage;
