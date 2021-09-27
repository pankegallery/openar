import { Box, Button, Flex, Text, chakra, Icon } from "@chakra-ui/react";

import Link from "next/link";
import { GrDrag } from "react-icons/gr";

import { SortableList } from "~/components/ui";

import { useRouter } from "next/router";
import { moduleArtworksConfig as moduleConfig } from "../config";
import { ArObjectStatusEnum } from "~/utils";
import { useArtworkReorderArObjectsMutation } from "~/hooks/mutations";

export const ModuleArtworkArObjectsList = ({
  data,
  errors,
  validationSchema,
  disableNavigation,
  setActiveUploadCounter,
}: {
  data?: any;
  errors?: any;
  validationSchema: any;
  setActiveUploadCounter?: Function;
  disableNavigation?: Function;
}) => {
  const { artworkReadOwn } = data ?? {};

  const router = useRouter();
  const [reorderMutation] =
    useArtworkReorderArObjectsMutation();

  const items = artworkReadOwn?.arObjects
    ? artworkReadOwn?.arObjects.map((arObject) => {
        let status = "Draft";

        switch (arObject.status) {
          case ArObjectStatusEnum.DRAFT:
            status = "draft";
            break;

          case ArObjectStatusEnum.PUBLISHED:
            status = "published";
            break;

          case ArObjectStatusEnum.MINT:
          case ArObjectStatusEnum.MINTING:
          case ArObjectStatusEnum.MINTRETRY:
          case ArObjectStatusEnum.MINTCONFIRM:
            status = "minting";
            break;

          case ArObjectStatusEnum.MINTERROR:
            status = "error";
            break;

          case ArObjectStatusEnum.MINTED:
            status = "minted";
            break;
        }

        return {
          id: `ar-${arObject.id}`,
          arObjectId: arObject.id,
          content: (
            <Box
              key={`arObj${arObject.key}`}
              borderTop="1px solid #fff"
              listStyleType="none"
              lineHeight="2.5rem"
              bg="openar.muddygreen"
            >
              <Link
                href={`${moduleConfig.rootPath}/${router.query.aid}/${arObject.id}/update`}
                passHref
              >
                <chakra.a
                  display="flex"
                  justifyContent="space-between"
                  transform="all 0.3s"
                  _hover={{
                    opacity: 0.6,
                  }}
                >
                  <Flex justifyContent="flex-start" alignItems="center">
                    <Icon
                      as={GrDrag}
                      w="4"
                      height="4"
                      filter="invert(100%)"
                      mr="1"
                    />
                    [{status}] {arObject.title}
                  </Flex>
                  <chakra.span>update</chakra.span>
                </chakra.a>
              </Link>
            </Box>
          ),
        };
      })
    : [];

  return (
    <>
      <Text mt="3">Objects</Text>

      {items && (
        <Box borderBottom="1px solid #fff">
          <SortableList
            items={items}
            onSortUpdate={(items) => {

              console.log("Items", items, items.map((item, index: number) => ({
                id: item.arObjectId,
                orderNumber: index + 1,
              })));
              reorderMutation(
                artworkReadOwn.id,
                items.map((item, index: number) => ({
                  id: item.arObjectId,
                  orderNumber: index + 1,
                }))
              );
            }}
          />
        </Box>
      )}
      <Box mt="4">
        <Button
          onClick={() => {
            router.push(`${moduleConfig.rootPath}/${router.query.aid}/create`);
          }}
        >
          Add Object
        </Button>
      </Box>
    </>
  );
};
export default ModuleArtworkArObjectsList;
