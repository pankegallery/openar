import { Box, Text } from "@chakra-ui/react";

import { LoadingIcon } from "~/components/ui";

export const ModulePage = ({
  isLoading = false,
  isError = false,
  errorInfo,
  children,
}: {
  isLoading?: boolean;
  isError?: boolean;
  errorInfo?: React.ReactNode | string;
  children: React.ReactNode;
}) => {
  const err = (
    <Text>
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
        layerStyle="pageContainerWhite"
        minH={{ base: 300, tw: "calc(100vh - 238px)" }}
        h="auto"
        position="relative"
      >
        {isLoading && <LoadingIcon type="inline" />}
        {isError && (errorInfo ? errorInfo : <>{err}</>)}
        {!isLoading && !isError && <>{children}</>}
      </Box>
    </>
  );
};
export default ModulePage;
