import { imageDeleteMutationGQL } from "~/graphql/mutations";

import { AspectRatio, Box, Button, Grid, Text, chakra } from "@chakra-ui/react";

import Link from "next/link";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
} from "~/components/forms";

import { yupIsFieldRequired, ModuleArtworkCreateSchema } from "../validation";
import { useRouter } from "next/router";
import { moduleArtworksConfig as moduleConfig } from "../config";
import { ArObjectStatusEnum } from "~/utils";

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

  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };


  return (
    <>  
      <Text mt="3">Objects</Text>

      <ul>
      {data?.artworkReadOwn?.arObjects &&
        data?.artworkReadOwn?.arObjects.map((arObject) => {
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
            case ArObjectStatusEnum.MINTERROR:
            case ArObjectStatusEnum.MINTRETRY:
            case ArObjectStatusEnum.MINTSIGNATUREREQUIRED:
              status = "minting";
              break;

            case ArObjectStatusEnum.MINTED:
              status = "minting";
              break;
          }

          return (
          <chakra.li key={`arObj${arObject.key}`} borderTop="1px solid #fff" listStyleType="none" _last={{
            borderBottom: "1px solid #fff"
          }} lineHeight="2.5rem">
            <Link
              href={`${moduleConfig.rootPath}/${router.query.aid}/${arObject.id}/update`}
              passHref
            >
              <chakra.a display="flex" justifyContent="space-between" transform="all 0.3s"_hover={{
                opacity: 0.6
              }}>[{status}] {arObject.title}<chakra.span>update</chakra.span></chakra.a>
            </Link>
          </chakra.li>
        )}
        )}
      </ul>
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
