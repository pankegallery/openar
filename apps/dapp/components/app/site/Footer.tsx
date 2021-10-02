import { Menu } from "~/components/frontend";
import { Box, chakra } from "@chakra-ui/react";
import { appConfig } from "~/config";

export const Footer = (/* props */) => {
  return (
    <Box
      w="100%"
      h="auto"
      borderTop="1px solid black"
      color="#555555"
      zIndex="201"
      p="6"
      layerStyle="backdropLight"
    >
      <chakra.nav
        className="main"
        display="flex"
        flexDirection="column"
        textStyle="small"
        sx={{
          a: {
            display: "block",
            my: "1",
            mr: "20",
          },
        }}
      >
        <Menu pages={appConfig.secondaryMenu} />
      </chakra.nav>
    </Box>
  );
};
