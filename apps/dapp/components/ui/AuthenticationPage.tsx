import { Box } from "@chakra-ui/react";
import React from "react";

export const AuthenticationPage = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <Box mt="4" textAlign="center" w="100%">
      {children}
    </Box>
  );
};
