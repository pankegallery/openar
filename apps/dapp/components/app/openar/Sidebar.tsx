import React from "react";

import { Box, chakra } from "@chakra-ui/react";
import { useAuthentication } from "~/hooks";
import { Menu } from "~/components/frontend";
import { appConfig } from "~/config";

export const Sidebar = () => {
  const [appUser] = useAuthentication();
  if (!appUser) return <></>;

  const mainMenu = [
    {
      slug: "profile",
      label: "My profile",
      url: "/x/",
    },
  ];

  const addMenu = [
    {
      slug: "newArtwork",
      label: " + Artwork",
      url: "/x/a/create",
    },
    {
      slug: "newExhibition",
      label: " + Exhibition",
      url: "/x/e/create",
    },
  ];

  return (
    <>
      <Box
        right="0"
        w="100%"
        minH="100%"
        borderLeft="1px solid #fff"
        display="flex"
        flexDirection="column"
        p="6"
        pt="40"
      >
        <Box position="sticky" top="40">
          {/*____________ Main login menu ____________*/}

          <chakra.nav
            className="addMenu"
            display="flex"
            flexDirection="column"
            flexWrap="nowrap"
            textStyle="subtitle"
            sx={{
              a: {
                display: "block",
                my: "2",
              },
            }}
          >
            <Menu pages={mainMenu} />
          </chakra.nav>

          {/*____________ Add items menu ____________*/}
          {appUser && appUser.roles && appUser.roles.includes("user") && (
            <>
              <Box mt="10" mb="2">
                <chakra.span textStyle="subtitle">Add</chakra.span>
              </Box>
              <chakra.nav
                className="addMenu"
                display="flex"
                flexDirection="column"
                flexWrap="nowrap"
                textStyle="subtitle"
                sx={{
                  a: {
                    display: "block",
                    my: "2",
                  },
                }}
              >
                <Menu pages={addMenu} />
              </chakra.nav>
            </>
          )}
        </Box>
        {/*____________ Footer menu ____________*/}

        <chakra.nav
          mt="auto"
          className="footerMenu"
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          textStyle="small"
          sx={{
            a: {
              display: "block",
              my: "1",
            },
          }}
        >
          <Menu pages={appConfig.secondaryMenu} />
        </chakra.nav>
      </Box>
    </>
  );
};