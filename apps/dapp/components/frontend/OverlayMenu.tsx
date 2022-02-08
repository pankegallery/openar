import React, { useState, useEffect } from "react";
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
import Router from "next/router";
import {RemoveScroll} from 'react-remove-scroll';

import { ActiveLink } from "~/components/ui";
import { WalletControl } from "~/components/app/shared";
import { useAuthentication, useSSRSaveMediaQuery } from "~/hooks";
import { Menu } from "~/components/frontend";

import { useWalletLogin } from "~/hooks";

import Close from "~/assets/img/close.svg";
import Logo from "~/assets/img/logo-white.svg";
import MenuCornerWhiteHover from "~/assets/img/menu-corner-light-hover.svg";
import MenuCornerWhite from "~/assets/img/menu-corner-light.svg";
import MenuCornerDarkHover from "~/assets/img/menu-corner-dark-hover.svg";
import MenuCornerDark from "~/assets/img/menu-corner-dark.svg";
import {appConfig } from "~/config";

export const OverlayMenu = ({ mode = "dark" }: { mode?: any }) => {
  const [appUser] = useAuthentication();

  const { account } = useWalletLogin();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [isClosing, setIsClosing] = useState(false);
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  const menuWidth = isDesktop ? "150px" : "100px";

  const aboutText = (
    <Box textStyle="subtitle">
      openAR is the world’s first cooperative platform for digital artists explicitly designed to help all artists prosper.
    </Box>
  );

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      onClose();
    };

    Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        onClick={onToggle}
        className="openOverlayMenu"
        w={menuWidth}
        h={menuWidth}
        position="fixed"
        top="0"
        right="0"
        zIndex="2000"
        p="0"
        border="0"
        variant="functional"
        sx={{
          "&:hover .menuCorner":{
            display: "none"
          },
          "& .menuCornerHover":{
            display: "none"
          },
          "&:hover .menuCornerHover":{
            display: "block"
          }
        }}
      >
        {mode === "light" && (
          <>
            <MenuCornerDark
              viewBox="0 0 120 120"
              width={menuWidth}
              height={menuWidth}
              className="menuCorner"
            />
            <MenuCornerDarkHover
              viewBox="0 0 240 240"
              width={{
                base: "100px",
                t: "150px",
              }}
              height={{
                base: "100px",
                t: "150px",
              }}
              className="menuCornerHover"
            />
          </>
        )}
        {mode === "dark" && (
          <>
            <MenuCornerWhite
              viewBox="0 0 120 120"
              width={menuWidth}
              height={menuWidth}
              className="menuCorner"
            />
            <MenuCornerWhiteHover
              viewBox="0 0 240 240"
              width={menuWidth}
              height={menuWidth}
              className="menuCornerHover"
            />
          </>
        )}
      </Button>

      <Portal>
          <Fade in={isOpen}>

          {(isOpen || isClosing) && <RemoveScroll>

            <Grid
              className="menu"
              position="fixed"
              top="0"
              left={isOpen || isClosing ? 0 : "-100vw"}
              w="100vw"
              h="100%"
              layerStyle="backdropSuperDark"
              zIndex="2001"
              templateRows={{
                base: "66.66vw 66.66vw auto",
                t: "var(--openar-header-height-desktop) 50vw auto",
                d: "var(--openar-header-height-desktop) 33.33vw auto",
              }}
              templateColumns="1fr"
              color="white"
              overflowX="hidden"
              overflowY="auto"
            >
              {/* --------- ROW: Logo and Close --------- */}
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
                flexWrap="wrap"
                onClick={() => {
                    setIsClosing(true);
                    onToggle();
                    setTimeout(() => {
                      setIsClosing(false);
                    }, 500);
                  }}
              >
                <Logo viewBox="4 8 70 70" width="120px" height="120px" />
                {!isDesktop && (
                  <Box
                    className="about"
                    p="0"
                    w={{
                      base: "85vw",
                      t: "66.66vw",
                    }}
                    h={{
                      base: "var(--openar-header-height-mobile)",
                      t: "33.33vw",
                    }}
                    order={{
                      base: 3,
                      t: "inherit",
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
                  <Close viewBox="0 -8 80 80" />
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
                {isDesktop && (
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
                    <Menu pages={appConfig.mainMenu} />
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
                      a: {
                        display: "block",
                        mb: "2",
                      },
                    }}
                  >
                    {account && appUser && (
                      <ActiveLink href={`/x/`}>Profile</ActiveLink>
                    )}
                    <WalletControl 
                      onCloseMenu={onClose}
                    />
                  </chakra.nav>
                </Box>
              </Flex>
              <Box
                className="footer"
                p="6"
                pb="2"
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
                minHeight="100px"
              >
                <chakra.nav
                  className="secondary"
                  display="flex"
                  flexWrap="wrap"
                  textStyle="small"
                  flexDirection="column"
                  maxHeight="110%"
                  sx={{
                    a: {
                      flex: "50% 0 0",
                      mb: "2",
                      mr: "4",
                    },
                  }}
                >
                  <Menu pages={appConfig.secondaryMenu} />
                </chakra.nav>
              </Box>
            </Grid>
            </RemoveScroll>}
          </Fade>
      </Portal>
    </>
  );
};
