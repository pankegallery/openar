import React from "react";

import { HiMenu } from "react-icons/hi";
import { MdClose } from "react-icons/md";

import {
  Box,
  Link,
  useDisclosure,
  IconButton,
  chakra,
} from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";

import { useSSRSaveMediaQuery } from "~/hooks";
import { WalletControl } from "../shared/WalletControl";

const NavItem = ({
  title,
  path,
  onClick,
}: {
  title: string;
  path: string;
  exact: boolean;
  onClick: Function;
}) => {
  return (
    <Box>
      <ActiveLink
        href={path}
        activeClassName="active"
        
        onClick={onClick as any}
      >
        <chakra.span>{title}</chakra.span>
      </ActiveLink>
    </Box>
  );
};

export const Sidebar = () => {
  const tw = useSSRSaveMediaQuery("(min-width: 55em)");
  
  const isMobile = tw ? false : true;
  
  const menuDisclosure = useDisclosure();

  const mainNavLinks = [
    {
      title: "Dashboard",
      path: "/openar",
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
    {
      title: "Collection",
      path: "/openar/collection",
      exact: false,
    },
  ];

  return (
    <>
      {isMobile && (
        <IconButton
          bg="white"
          color="black"
          size="sm"
          position="fixed"
          top="4px"
          left="2"
          w="40px"
          h="40px"
          zIndex="1311"
          onClick={menuDisclosure.onToggle}
          icon={menuDisclosure.isOpen ? <MdClose /> : <HiMenu />}
          fontSize="30px"
          aria-label={menuDisclosure.isOpen ? "Close menu" : "Open menu"}
          _hover={{
            bg: "white",
          }}
        />
      )}
      <Box
        w="100%"
        h="100vh"
        maxW={{ base: "100%", tw: "max(250px, 20vw)" }}
        className={`${isMobile ? "active" : "inactive"} ${
          !menuDisclosure.isOpen || !isMobile ? "closed" : "open"
        }`}
        overflow="hidden"
        overflowY="auto"
        sx={{
          "&.inactive": {
            position: "sticky",
            top: 0,
          },
          "&.active": {
            position: "fixed",
            transform: "translateX(-100%)",
            zIndex: 1310,
            bg: "white",
            pt:"10",
            top: 0,
            height: "100%",
            overflow: "auto",
            transition: "all 0.2s",
          },
          "&.active > div": {
            shadow: "none",
          },
          "&.active.open": {
            transform: "translateX(0%)",
          },
        }}
      >
        <Box
          w="100%"
          p="4"
          minH="100%"
          borderLeft="1px solid #fff"
        >
          {mainNavLinks.map((link) => {
            return (
              <NavItem
                key={link.path}
                {...link}
                onClick={menuDisclosure.onClose}
              />
            );
          })}

          <WalletControl/>
        </Box>
      </Box>
    </>
  );
};
