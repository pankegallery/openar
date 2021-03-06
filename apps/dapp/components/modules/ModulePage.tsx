import { Box, Text } from "@chakra-ui/react";

import { LoadingIcon } from "~/components/ui";

export const ModulePage = ({
  isLoading = false,
  isError = false,
  isAccessDenied = false,
  errorInfo,
  children,
}: {
  isLoading?: boolean;
  isAccessDenied?: boolean;
  isError?: boolean;
  errorInfo?: React.ReactNode | string;
  children: React.ReactNode;
}) => {
  const err = (
    <Text p="3">
      <b>We are sorry</b>
      <br />
      Something went wrong and the needed information could not be loaded.
      Please try again later
    </Text>
  );

  // t("general.writeerror.desc", "Something went wrong and the needed information could not be processed. Please try again later")
  return (
    <>
      <Box
        position="relative"
      >
        {isLoading && <LoadingIcon type="inline" position="fixed" />}
        {isAccessDenied && <Box p="6">Access denied</Box>}
        {isError && (errorInfo ? errorInfo : <>{err}</>)}
        {!isLoading && !isError && <>{children}</>}
      </Box>
    </>
  );
};
export default ModulePage;
