import { ActiveLink } from "~/components/ui";
import {
  Box,
  chakra
} from "@chakra-ui/react";

export const Footer = (/* props */) => {

  const footerMenu = [
    {slug: "discord",     label:"Discord"              , url:"discord"},
    {slug: "imprint",     label:"Imprint"              , url:"p/imprint"},
    {slug: "tandc",       label:"Terms and Conditions" , url:"p/tandc"},
    {slug: "funding",     label:"Platform funding"     , url:"p/funding"},
  ]

  return (
    <Box
      w={{
        base: "100%",
        d: "calc(33.33vw + 0px)"
      }}
      h={{
        base: "auto",
        d: "calc(100vh - 33.33vw + 4px - var(--openar-header-height-desktop))"
      }}
      borderTop="1px solid black"
      borderRight="1px solid black"
      color="#555555"
      position={{
        base: "relative",
        d: "fixed"
      }}
      bottom="0"
      left="0"
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
        {
          footerMenu.map(menuItem => (
            <ActiveLink
              key={menuItem.slug}
              href={`/${menuItem.url}`}
            >
              {menuItem.label}
            </ActiveLink>
          ))
        }
      </chakra.nav>
    </Box>
    );
};

