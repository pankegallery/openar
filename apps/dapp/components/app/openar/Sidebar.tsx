import React from "react";

import { Box, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";
import { useAuthentication } from "~/hooks";
import { Menu } from "~/components/frontend";


const NavItem = ({
  title,
  path,
  onClick,
}: {
  title: string;
  path: string;
  exact: boolean;
  onClick?: Function;
}) => {
  return (
    <Box>
      <ActiveLink href={path} activeClassName="active" onClick={onClick as any}>
        <chakra.span textStyle="subtitle" mb="2" display="inline-flex">{title}</chakra.span>
      </ActiveLink>
    </Box>
  );
};

export const Sidebar = () => {
  const [appUser] = useAuthentication();
  if (!appUser)
    return <></>;

  const mainNavLinks = [
    {
      title: "+ Artwork",
      path: "/x/a/create",
      exact: false,
    },
  ];

  const footerMenu = [
    {slug: "discord",     label:"Discord"              , url:"discord"},
    {slug: "imprint",     label:"Imprint"              , url:"p/imprint"},
    {slug: "tandc",       label:"Terms and Conditions" , url:"p/tandc"},
    {slug: "logout",      label:"Logout              " , url:"p/funding"},
  ]

  return (
    <>
      <Box
        position="sticky"
        right="0"
        w="100%"
        minH="100%"
        borderLeft="1px solid #fff"
        display="flex"
        flexDirection="column"
        p="6"
        pt="40"
      >
        <Box>
          <NavItem
            title="My profile"
            path={`/x/`}
            exact
          />
          <Box mt="10" mb="2">
            <chakra.span textStyle="subtitle">Add</chakra.span>
          </Box>
          {mainNavLinks.map((link) => {
            return <NavItem key={link.path} {...link} />;
          })}
        </Box>


        <chakra.nav
          mt="auto"
          className="footerMenu"
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          textStyle="small"
          sx={{
            "a": {
              display: "block",
              my: "1",
            }
          }}
        >
          <Menu pages={footerMenu} />
        </chakra.nav>
      </Box>
    </>
  );
};
