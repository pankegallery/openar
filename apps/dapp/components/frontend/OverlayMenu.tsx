import React, { useState } from "react";
import {
  useDisclosure,
  Portal,
  Button,
  Box,
  Grid,
  Flex,
  Fade,
  chakra,
} from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";
import { WalletControl } from "~/components/app/shared";
import { useSSRSaveMediaQuery } from "~/hooks";
import { Menu } from "~/components/frontend";

import { useWalletLogin } from "~/hooks";

import Close from "~/assets/img/close.svg";
import Logo from "~/assets/img/logo-white.svg";
import MenuCornerWhite from "~/assets/img/menu-corner-light.svg";

export const OverlayMenu = () => {
  const { account} = useWalletLogin();
  const { isOpen, onToggle } = useDisclosure();
  const [isClosing, setIsClosing] = useState(false);
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45rem) and (max-width: 74em)"
  );
  const aboutText = (
    <Box textStyle="subtitle">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a
      sodales nulla, sed semper nisi.
    </Box>
  );

  const mainMenu = [
    { slug: "exhibitions", label: "Exhibitions", url: "" },
    { slug: "artworks", label: "Artworks", url: "artworks" },
    { slug: "about", label: "About", url: "pages/about" },
    { slug: "blog", label: "Blog", url: "pages/blog" },
  ];

  const secondaryMenu = [
    { slug: "help", label: "Help", url: "pages/help" },
    { slug: "badges", label: "Roles and Badges", url: "pages/tandc" },
    { slug: "wallets", label: "Wallets", url: "pages/wallets" },
    { slug: "tandc", label: "Terms and Conditions", url: "pages/tandc" },
    { slug: "funding", label: "Platform funding", url: "pages/funding" },
    { slug: "privpol", label: "Privacy policy", url: "pages/privpol" },
    { slug: "imprint", label: "Imprint", url: "pages/imprint" },
  ];

  return (
    <>
      <Button
        onClick={onToggle}
        w="100px"
        h="100"
        position="fixed"
        top="0"
        right="0"
        zIndex="300"
        p="0"
        border="0"
        variant="functional"
      >
        <MenuCornerWhite viewBox="0 0 120 120" width="120px" height="120px" />
      </Button>

      <Portal>
        <Fade in={isOpen}>
          <Grid
            className="menu"
            position={isOpen || isClosing ? "absolute" : "fixed"}
            top="0"
            left={isOpen || isClosing ? 0 : "-100vw"}
            w="100vw"
            h="100%"
            layerStyle="backdropDark"
            zIndex="301"
            templateRows={{
              base: "var(--openar-header-height-mobile) 100vw auto",
              t: "var(--openar-header-height-desktop) 50vw auto",
              d: "var(--openar-header-height-desktop) 33.33vw auto",
            }}
            color="white"
          >
            {/* --------- Logo and Clo  se --------- */}
            <Flex
              className="Header"
              w="100vw"
              h={{
                base: "var(--openar-header-height-mobile)",
                t: "var(--openar-header-height-desktop)",
              }}
              p="6"
              pr="2"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Logo viewBox="4 8 70 70" width="120px" height="120px" />
              {isTablet && (
                <Box
                  className="about"
                  p="0"
                  w="66.66vw"
                  h={{
                    base: "var(--openar-header-height-mobile)",
                    t: "33.33vw",
                  }}
                >
                  {aboutText}
                </Box>
              )}
              <Button
                onClick={() => {
                  setIsClosing(true);
                  onToggle();
                  setTimeout(() => {
                    setIsClosing(false);
                  }, 500);
                }}
                variant="functional"
              >
                <Close viewBox="-40 -8 80 80" />
              </Button>
            </Flex>
            {/* --------- About, main nav, login nav --------- */}
            <Flex
              className="main"
              w="100%"
              borderBottom="1px solid #fff"
              flexWrap="wrap"
              direction="row"
              zIndex="302"
            >
              {!isTablet && (
                <Flex
                  className="about"
                  p={{
                    base: "4",
                    tw: "6",
                  }}
                  w={{
                    base: "100%",
                    d: "33.33vw",
                  }}
                  h={{
                    base: "var(--openar-header-height-mobile)",
                    d: "33.33vw",
                  }}
                  borderTop={{
                    base: "none",
                    d: "1px solid #fff",
                  }}
                  alignItems="end"
                >
                  {aboutText}
                </Flex>
              )}
              <Flex
                borderTop="1px solid #fff"
                borderRight="1px solid #fff"
                borderLeft={{
                  base: "none",
                  d: "1px solid #fff",
                }}
                p="6"
                w={{
                  base: "66.66vw",
                  t: "50vw",
                  d: "33.33vw",
                }}
                h={{
                  base: "calc(66.66vw - 1px)",
                  t: "calc(50vw - 1px)",
                  d: "calc(33.33vw - 1px)",
                }}
                layerStyle="backdropDark"
                alignItems="end"
              >
                <chakra.nav
                  className="main"
                  textStyle="worktitle"
                  sx={{
                    a: {
                      display: "block",
                      mb: "2",
                    },
                  }}
                >
                  <Menu pages={mainMenu} />
                </chakra.nav>
              </Flex>
              <Box
                w={{
                  base: "calc(33.33vw - 2px)",
                  t: "calc(50vw - 2px)",
                  d: "calc(33.33vw - 2px)",
                }}
                p="6"
                h={{
                  base: "66.66vw",
                  t: "50vw",
                  d: "33.33vw",
                }}
                borderTop="1px solid #fff"
                layerStyle="backdropBlurred"
              >
                <chakra.nav
                  className="main"
                  textStyle="worktitle"
                  sx={{
                    "a": {
                      display: "block",
                      mb: "2",
                    }
                  }}
                >
                  {account && (
                    <ActiveLink href="/openar">Dashboard</ActiveLink>
                  )}
                  <WalletControl />
                </chakra.nav>
              </Box>
            </Flex>
            <Box
              className="footer"
              p="6"
              layerStyle="backdropGradient"
              w={{
                base: "66.66vw",
                t: "calc(50vw + 1px)",
                d: "33.33vw",
              }}
              borderRight={{
                base: "1px solid #fff",
                t: "none",
                d: "1px solid #fff",
              }}
              borderLeft={{
                t: "1px solid #fff",
              }}
              justifySelf={{
                base: "start",
                t: "end",
                d: "center",
              }}
            >
              <chakra.nav
                className="secondary"
                display="flex"
                flexWrap="wrap"
                textStyle="small"
                sx={{
                  a: {
                    flex: "50% 0 0",
                    mb: "2",
                  },
                }}
              >
                <Menu pages={secondaryMenu} />
              </chakra.nav>
            </Box>
          </Grid>
        </Fade>
      </Portal>
    </>
  );
};
