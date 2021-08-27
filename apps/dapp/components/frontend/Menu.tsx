import React, { useState } from "react";
import {
  useDisclosure,
  Portal,
  Button,
  Box,
  Grid,
  Flex,
  Fade,
} from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";
import { WalletControl } from "~/components/app/shared";
import { useSSRSaveMediaQuery } from "~/hooks";
import Close from "~/assets/img/close.svg";

export const Menu = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [isClosing, setIsClosing] = useState(false);
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45rem) and (max-width: 74em)"
  );
  const aboutText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sodales nulla, sed semper nisi.";

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
        bg="#f0f0f0"
      >
        Menu button
      </Button>

      <Portal>
        <Fade in={isOpen}>
          <Grid
            className="menu"
            position="fixed"
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
            {/* --------- Logo and Close --------- */}
            <Flex
              className="Header"
              w="100vw"
              h={{
                base: "var(--openar-header-height-mobile)",
                t: "var(--openar-header-height-desktop)",
              }}
              p="6"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box
                p={{
                  base: "4",
                  t: "6",
                }}
              >
                LOGO
              </Box>
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
                border="none"
              >
                <Close/>
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
                  base: "66.66vw",
                  t: "50vw",
                  d: "33.33vw",
                }}
                layerStyle="backdropDark"
              >
                <nav className="main">
                  <ActiveLink key="m1" href="/exhibitions/">
                    Exhibitions
                  </ActiveLink>
                  <ActiveLink key="m2" href="/artworks/">
                    Artworks
                  </ActiveLink>
                  <ActiveLink key="m3" href="/pages/about/">
                    Artworks
                  </ActiveLink>
                  <ActiveLink key="m4" href="/pages/help/">
                    Blog
                  </ActiveLink>
                </nav>
              </Flex>
              <Flex
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
              >
                <WalletControl />
              </Flex>
            </Flex>
            <Box
              className="footer"
              layerStyle="backdropGradient"
              w={{
                base: "66.66vw",
                t: "33.33vw",
              }}
              borderRight="1px solid #fff"
              borderLeft={{
                t: "1px solid #fff",
              }}
              justifySelf={{
                base: "start",
                d: "center",
              }}
            >
              <nav className="secondary">
                <ActiveLink key="s1" href="/pages/help/">
                  Help
                </ActiveLink>
                <ActiveLink key="s2" href="/pages/tandc/">
                  Roles and Badges
                </ActiveLink>
                <ActiveLink key="s3" href="/pages/wallets/">
                  Wallets
                </ActiveLink>
                <ActiveLink key="s4" href="/pages/tandc/">
                  Terms and Conditions
                </ActiveLink>
                <ActiveLink key="s5" href="/pages/funding/">
                  Platform funding
                </ActiveLink>
                <ActiveLink key="s6" href="/pages/privpol/">
                  Privacy Policy
                </ActiveLink>
                <ActiveLink key="s7" href="/pages/imprint/">
                  Imprint
                </ActiveLink>
              </nav>
            </Box>
          </Grid>
        </Fade>
      </Portal>
    </>
  );
};
