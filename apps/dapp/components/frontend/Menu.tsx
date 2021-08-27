import React from "react";
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

export const Menu = () => {
  const { isOpen, onToggle } = useDisclosure();

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
            lleft="0"
            w="100vw"
            h="100%"
            layerStyle="backdropDark"
            zIndex="301"
            templateRows={{
              base: "var(--openar-header-height-mobile) 100vw auto",
              t: "var(--openar-header-height-desktop) 33.33vw auto",
            }}
            color="white"
          >
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
              <Button onClick={onToggle}>X</Button>
            </Flex>
            <Flex
              className="main"
              w="100%"
              borderBottom="1px solid #fff"
              flexWrap="wrap"
              direction="row"
            >
              <Flex
                className="left"
                p={{
                  base: "4",
                  tw: "6",
                }}
                w={{
                  base: "100%",
                  t: "33.33vw",
                }}
                h={{
                  base: "var(--openar-header-height-mobile)",
                  t: "33.33vw",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse a sodales nulla, sed semper nisi.
              </Flex>
              <Flex
                borderTop="1px solid #fff"
                borderRight="1px solid #fff"
                p="6"
                w={{
                  base: "66.66vw",
                  t: "33.33vw",
                }}
                h={{
                  base: "66.66vw",
                  t: "33.33vw",
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
                    Help
                  </ActiveLink>
                </nav>
              </Flex>
              <Flex
                w="calc(33.33vw - 2px)"
                h={{
                  base: "66.66vw",
                  t: "33.33vw",
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
                t:"1px solid #fff"
              }}
              justifySelf={{
                base: "start",
                d: "center",
              }}
            >
              <nav className="secondary">
                <ActiveLink key="s1" href="/pages/imprint/">
                  Imprint
                </ActiveLink>
                <ActiveLink key="s2" href="/pages/tandc/">
                  Terms and conditions
                </ActiveLink>
                <ActiveLink key="s3" href="/pages/funding/">
                  Platform funding
                </ActiveLink>
              </nav>
            </Box>
          </Grid>
        </Fade>
      </Portal>
    </>
  );
};
