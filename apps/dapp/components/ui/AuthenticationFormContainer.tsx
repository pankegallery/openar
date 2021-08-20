import React from "react";
import { Box } from "@chakra-ui/react";

export const AuthenticationFormContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <Box
      layerStyle="pageContainerGray"
      padding={{ base: 4, t: 5, d: 7 }}
      mt="4"
    >
      {children}
    </Box>
  );
};
