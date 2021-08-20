import React from "react";
import { ActiveLink } from "~/components/ui";

import { Flex, HStack, Link } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import { useConfigContext } from "~/provider";
import { MultiLangValue } from "../ui";
import { HiLink } from "react-icons/hi";

export const Footer = ({ type = "full" }: { type?: string }) => {
  const config = useConfigContext();

  const { t } = useTranslation();

  return (
    <Flex textAlign="center" justifyContent="center" position="fixed" bottom="0" left="50%" zIndex="5" transform="translateX(-50%) translateY(-25%)">
      <HStack spacing="8" >
        <Link
          href={`mailto:${config.contactEmail}`}
        >
          {t("footer.contactLink.title", "Contact")}
        </Link>
        <ActiveLink
          href="/page/impressum/"
          
      >
          <MultiLangValue json={{en:"Imprint",de:"Impressum"}} />
        </ActiveLink>
        
      </HStack>
      
    </Flex>
  );
};

export default Footer;