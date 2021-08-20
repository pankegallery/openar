import { Box, Text, Heading } from "@chakra-ui/react";

export const ModulePageAccessDenied = () => {
  return (
    <>
      <Box
        layerStyle="pageContainerWhite"
        minH={{ base: "calc(100vh - 106px)", tw: "calc(100vh - 142px)" }}
      >
        <Heading as="h2" mb="2">
          Access denied
        </Heading>
        <Text mb="4">You don&#39;t have permission to see this page.</Text>
      </Box>
    </>
  );
};
export default ModulePageAccessDenied;
