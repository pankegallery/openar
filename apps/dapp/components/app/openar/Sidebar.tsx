import React from "react";

import { Box, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";

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
  const mainNavLinks = [
    {
      title: "Dashboard",
      path: "/openar/",
      exact: true,
    },
    {
      title: "Profile",
      path: "/openar/profile",
      exact: false,
    },
    {
      title: "Artworks",
      path: "/openar/artworks",
      exact: false,
    },
    // {
    //   title: "Collection",
    //   path: "/openar/collection",
    //   exact: false,
    // },
  ];

  return (
    <>
      <Box w="100%" p="4" minH="100%" borderLeft="1px solid #fff">
        {mainNavLinks.map((link) => {
          return <NavItem key={link.path} {...link} />;
        })}
      </Box>
    </>
  );
};
