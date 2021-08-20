import React, { MouseEventHandler,useState, useEffect } from "react";
import {
  HiMenu,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { RiCalendarEventLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { default as RouterLink} from 'next/link'
import {
  Box,
  Link,
  Icon,
  useDisclosure,
  IconButton,
  chakra
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { InlineLanguageButtons, ActiveLink } from "~/components/ui";

import { useSSRSaveMediaQuery } from "~/hooks";

const NavItem = ({
  title,
  path,
  icon,
  onClick,
}: {
  title: string;
  path: string;
  exact: boolean;
  icon: any;
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
        <chakra.span><Icon as={icon} mr="2" />
        {title}</chakra.span>
      </Link>
    </Box>
  );
};

export const Sidebar = () => {
  const { t } = useTranslation();
  
  const tw = useSSRSaveMediaQuery("(min-width: 55em)");
  
  const isMobile = tw ? false : true;

  const { isOpen, onToggle, onClose } = useDisclosure();

  const mainNavLinks = [
    {
      title: t("mainnav.home.title", "Home"),
      path: "/",
      exact: true,
      icon: HiOutlineHome,
    },
    {
      title: t("mainnav.locations.title", "Locations"),
      path: "/locations",
      exact: false,
      icon: HiOutlineLocationMarker,
    },
    {
      title: t("mainnav.events.title", "Events"),
      path: "/events",
      exact: false,
      icon: RiCalendarEventLine,
    },
    {
      title: t("mainnav.page.title", "About Us"),
      path: "/page/about-us",
      exact: false,
      icon: HiOutlineDocumentText,
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
          onClick={onToggle}
          icon={isOpen ? <MdClose /> : <HiMenu />}
          fontSize="30px"
          aria-label={
            isOpen ? t("menu.close", "Close menu") : t("menu.open", "Open menu")
          }
          _hover={{
            bg: "white",
          }}
        />
      )}
      <Box
        w="100%"
        maxW={{ base: "100%", tw: "calc(260px + 2rem)" }}
        className={`${isMobile ? "active" : "inactive"} ${
          !isOpen || !isMobile ? "closed" : "open"
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
            transition: "all 0.2s"
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
            return <NavItem key={link.path} {...link} onClick={onClose} />;
          })}

         
        </Box>
      </Box>
    </>
  );
};