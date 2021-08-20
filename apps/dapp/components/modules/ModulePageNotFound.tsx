import { Box, Text, Heading } from "@chakra-ui/react";

export const ModulePageNotFound = () => {
  return (
    <>
      <Box
        layerStyle="pageContainerWhite"
        minH={{ base: "calc(100vh - 106px)", tw: "calc(100vh - 142px)" }}
      >
        <Heading as="h2" mb="2">
          Not found
        </Heading>
        <Text mb="4">The requested URL could not be found.</Text>
      </Box>
    </>
  );
};
export default ModulePageNotFound;
