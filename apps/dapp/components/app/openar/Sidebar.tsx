import React from "react";

import { Box, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";
import { useAuthentication } from "~/hooks";

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
        <chakra.span>{title}</chakra.span>
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
      title: "+ Artworks",
      path: "/x/a/create",
      exact: false,
    },
  ];

  return (
    <>
      <Box w="100%" minH="100%" borderLeft="1px solid #fff" position="relative">
        <Box  position="sticky" top="0" p="4">
          <NavItem
            title="My profile"
            path={`/x/`}
            exact
          />
          <Box mt="12">
          Add
          </Box>
          {mainNavLinks.map((link) => {
            return <NavItem key={link.path} {...link} />;
          })}
        </Box>


        <Box>
          Footer navigation ... 
        </Box>
      </Box>
    </>
  );
};
