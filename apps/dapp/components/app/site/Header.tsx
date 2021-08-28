import { ActiveLink } from "~/components/ui";
import { Menu } from "~/components/frontend";
import {
  Box,
  chakra
} from "@chakra-ui/react";

export const Header = (/* props */) => {

  const headerMenu = [
    {slug: "exhibitions", label:"Exhibitions"      , url:""},
    {slug: "artworks",    label:"Artworks"         , url:"artworks"},
    {slug: "about",       label:"About"            , url:"pages/about"},
    {slug: "blog",        label:"Blog"             , url:"pages/blog"},
    {slug: "help",        label:"Help"             , url:"pages/help"},
    {slug: "badges",      label:"Roles and Badges" , url:"pages/tandc"},
    {slug: "wallets",     label:"Wallets"          , url:"pages/wallets"},
  ]

  return (
    <Box
      h="var(--openar-header-height-desktop)"
      w="100%"
      borderBottom="1px solid black"
      color="#555555"
      position="fixed"
      zIndex="201"
      p="6"
      layerStyle="backdropLight"
    >
      <chakra.nav
        className="main"
        h="100%"
        w="50%"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
        textStyle="h2"
        justifyContent="center"
        sx={{
          "a": {
            display: "block",
            my: "1",
            mr: "20"
          }
        }}
      >
        <Menu pages={headerMenu} />
      </chakra.nav>
    </Box>
    );
};

