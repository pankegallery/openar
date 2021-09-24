import { useEffect, ReactElement } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Text, Box, Flex, Button } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import { LayoutOpenAR } from "~/components/app";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
  isArObjectReadyToMint,
  isArObjectMinting
} from "~/components/modules";
import { ShowUrlAndCopy } from "~/components/frontend";

import { appConfig } from "~/config";
import { trimStringToLength } from "~/utils";

export const arObjectReadOwnQueryGQL = gql`
  query arObjectReadOwn($id: Int!, $aid: Int!) {
    arObjectReadOwn(id: $id) {
      id
      status
      key
      arModels {
        id
        type
        status
      }
      heroImage {
        id
      }
    }
    artworkReadOwn(id: $aid) {
      id
      title
      description
      status
      key
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

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`,
      title:
        data &&
        (data.artworkReadOwn?.title ? (
          trimStringToLength(data.artworkReadOwn?.title, 13)
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

  const isReadyToMint = data && isArObjectReadyToMint(data);

  useEffect(() => {
    if (data && isArObjectMinting(data))
      Router.replace(
        `${moduleConfig.rootPath}/${Router.query.aid}/${Router.query.oid}/update`
      );
  }, [data]);

  return (
    <>
      <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
      <ModulePage
        isLoading={loading}
        isError={!!error || (!error && !loading && !data?.arObjectReadOwn)}
      >
        {!isReadyToMint && (
          <Text
            width="100%"
            p="6"
            borderBottom="1px solid #fff"
            color="openar.error"
          >
            It looks like your object is not ready to be minted please ensure
            that artwork and object are published, neccessary fields are filled
            in, and all assets are uploaded
          </Text>
        )}

        {isReadyToMint && (
          <Box p="6" maxW="800px">
            <Text>
              As minting an object can not be reversed please make sure that
              your object looks and works as intended (try and Android and iOS
              device if you can). You can access the object using the following
              URL
            </Text>

            <Flex my={2}>
              <ShowUrlAndCopy url={href} />
            </Flex>

            <Link
              href={`${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/mint`}
              passHref
            >
              <Button mt="4">All looks good, proceed</Button>
            </Link>
          </Box>
        )}
      </ModulePage>
    </>
  );
};

Update.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Update, "artworkUpdateOwn");
