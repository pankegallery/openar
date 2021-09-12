import { ActiveLink } from "~/components/ui";
import { Menu } from "~/components/frontend";
import {
  Box,
  chakra
} from "@chakra-ui/react";

export const Footer = (/* props */) => {

  const footerMenu = [
    {slug: "discord",     label:"Discord"              , url:"https://discord.gg/efGHVEKM"},
    {slug: "imprint",     label:"Imprint"              , url:"/p/imprint"},
    {slug: "tandc",       label:"Terms and Conditions" , url:"/p/tandc"},
    {slug: "funding",     label:"Platform funding"     , url:"/p/funding"},
  ]

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
          "a": {
            display: "block",
            my: "1",
            mr: "20"
          }
        }}
      >
        <Menu pages={footerMenu} />
      </chakra.nav>
    </Box>
    );
};

