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
      w="100%"
      borderTop="1px solid #fff"
      height="4rem"
    >
      <HStack spacing="8">
        <Link href={`mailto:${config.contactEmail}`}>Contact</Link>
        <ActiveLink href="/pages/impressum/">Imprint</ActiveLink>
      </HStack>
    </Flex>
  );
};

export default Footer;
