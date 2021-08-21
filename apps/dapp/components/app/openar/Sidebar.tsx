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
import { WalletControl } from "./WalletControl";

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
      <Link
        as={ActiveLink}
        href={path}
        display="flex"
        alignItems="center"
        fontSize="lg"
        color="var(--chakra-colors-gray-800) !important"
        ml="-3px"
        pl="1"
        py="1"
        transition="all 0.3s"
        activeClassName="active"
        _hover={{
          textDecoration: "none",
          color: "var(--chakra-colors-wine-600) !important",
        }}
        sx={{
          "&.active": {
            color: "var(--chakra-colors-wine-600) !important",
          },
          "&.active .chakra-icon": {
            color: "var(--chakra-colors-wine-600) !important",
          },
        }}
        onClick={onClick as any}
      >
        <chakra.span>{title}</chakra.span>
      </Link>
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
      title: "Artworks",
      path: "/openar/artworks",
      exact: true,
    },
    {
      title: "Collection",
      path: "/openar/collection",
      exact: true,
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
          left="4"
          w="40px"
          h="40px"
          zIndex="toast"
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
        maxW={{ base: "100%", tw: "calc(260px + 2rem)" }}
        className={`${isMobile ? "active" : "inactive"} ${
          !menuDisclosure.isOpen || !isMobile ? "closed" : "open"
        }`}
        pr={{ base: 3, tw: 0 }}
        pl={{ base: 3, tw: 4 }}
        pb={{ base: 3, tw: 4 }}
        position="sticky"
        top={{ base: "48px", tw: "68px" }}
        sx={{
          "&.active": {
            position: "fixed",
            transform: "translateX(-100%)",
            zIndex: "popover",
            bg: "white",
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
          layerStyle="pageContainerWhite"
          mt={{ base: 12, tw: "1.37rem" }}
          w={{ base: "100%", tw: "260px" }}
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
