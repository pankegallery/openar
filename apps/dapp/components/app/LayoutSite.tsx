import { ReactNode } from "react";
import Head from "next/head";
import { Box, Flex, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";

import { Footer, Header } from "./site";
import { WalletConnectGate } from "./shared";
import { LoadingBar } from "~/components/app/shared";
import { OverlayMenu } from "../frontend";

export const LayoutSite = ({
  children,
  title,
  subPages,
}: {
  children: ReactNode;
  title: string;
  subPages: any[]
}) => {
  return (
    <WalletConnectGate>
      <LoadingBar color="#000" />
      <Box
        className="site content text light"
        w="100vw"
        h="100%"
        layerStyle="backdropLight"
        overflow="hidden"
      >
        <Header />
        {/* --------- Title and Submenu --------- */}
        <Flex
          position="fixed"
          flexDirection="column"
          bg="white"
          top="var(--openar-header-height-desktop)"
          left="0"
          w={{
            base: "100%",
            t: "33.33vw",
          }}
          h="calc(100vh - var(--openar-header-height-desktop))"
          zIndex="200"
          color="black"
          overflow="hidden"
          p="6"
          borderRight="1px solid black"
        >
          <chakra.h1 textStyle="worktitle">{title}</chakra.h1>
          {subPages &&
            subPages.map((subPage) => (
              <ActiveLink key={subPage.slug} href={`/${subPage.url}`}>
                {subPage.label}
              </ActiveLink>
            ))}
        </Flex>
        {/* --------- Page content --------- */}
        <Box
          position={{
            base: "relative",
            t: "fixed",
          }}
          top="var(--openar-header-height-desktop)"
          left={{
            base: "100%",
            t: "33.33vw",
          }}
          p="6"
          h={{
            base: "auto",
            t: "calc(100vh - var(--openar-header-height-desktop))",
          }}
          overflow="scroll"
        >
          {children}
        </Box>
        <Footer />
      </Box>
      <OverlayMenu />
    </WalletConnectGate>
  );
};
export default LayoutSite;
