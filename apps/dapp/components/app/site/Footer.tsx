import React from "react";
import { ActiveLink } from "~/components/ui";

import { Flex, HStack, Link } from "@chakra-ui/react";

import { useConfigContext } from "~/providers";

export const Footer = ({ type = "full" }: { type?: string }) => {
  const config = useConfigContext();

  return (
    <Flex
      textAlign="center"
      justifyContent="center"
      position="fixed"
      bottom="0"
      left="50%"
      zIndex="5"
      transform="translateX(-50%) translateY(-25%)"
    >
      <HStack spacing="8">
        <Link href={`mailto:${config.contactEmail}`}>Contact</Link>
        <ActiveLink href="/pages/impressum/">Imprint</ActiveLink>
      </HStack>
    </Flex>
  );
};

export default Footer;
