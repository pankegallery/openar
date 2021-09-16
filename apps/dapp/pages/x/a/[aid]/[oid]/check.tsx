import { useState, ReactElement } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { Text, Box, IconButton, useClipboard, Flex, Button } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import { LayoutOpenAR } from "~/components/app";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";
import { MdContentCopy } from "react-icons/md";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";
import { appConfig } from "~/config";

// TODO
export const arObjectReadOwnQueryGQL = gql`
  query arObjectReadOwn($id: Int!, $aid: Int!) {
    arObjectReadOwn(id: $id) {
      id
      key
      title
    }
    artworkReadOwn(id: $aid) {
      id
      key
      title
    }
  }
`;

const Update = () => {
  const router = useRouter();
  

  const { data, loading, error } = useQuery(arObjectReadOwnQueryGQL, {
    variables: {
      id: parseInt(router.query.oid as string, 10),
      aid: parseInt(router.query.aid as string, 10),
    },
  });

  const href = `${appConfig.baseUrl}/a/${data?.artworkReadOwn?.key}/${data?.arObjectReadOwn?.key}/`;
  const { hasCopied, onCopy } = useClipboard(href);


  // TODO: make more general
  const trimTitle = (str: string) =>
    str.length > 13 ? `${str.substr(0, 10)}...` : str;

  const breadcrumb = [
    {
      path: moduleConfig.rootPath,
      title: "Artworks",
    },
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title:
        data &&
        (data.artworkReadOwn?.title ? (
          trimTitle(data.artworkReadOwn?.title)
        ) : (
          <BeatLoader size="10px" color="#fff" />
        )),
    },
    {
      title: "Mint object",
    },
  ];

  // TODO: this makes some trouble on SSR as the buttons look differently
  // as the user can't do thing on the server
  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`,
      label: "Cancel",
      userCan: "artworkReadOwn",
    },
  ];

  return (
    <>
      <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
      <ModulePage
        isLoading={loading}
        isError={!!error || (!error && !loading && !data?.arObjectReadOwn)}
      >
        <Box p="6" maxW="800px">
          <Text>
            As minting an object can not be reversed please make sure that your
            object looks and works as intended (try and Android and iOS device
            if you can). You can access the object using the following URL
          </Text>
          <Flex my={2}>
            <a href={href} target="_blank" rel="noreferrer">
              {href}
            </a>
            <IconButton onClick={onCopy} ml={2} icon={<MdContentCopy />} aria-label="copy" border="none" bg="transparent" _hover={{
              bg: "none",
              opacity: 0.6
            }} _active={{
              bg:"transparent",
              color: "green.300"
            }} h="30px" fontSize="lg" justifyContent="flex-start">
              {hasCopied ? "Copied" : "Copy"}
            </IconButton>
          </Flex>

          <Link
            href={`${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/mint`}
            passHref
          >
            <Button mt="4">All looks good, proceed</Button>
          </Link>
        </Box>
      </ModulePage>
    </>
  );
};

Update.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Update, "artworkUpdateOwn");
