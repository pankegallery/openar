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

  console.log(data);

  return (
    <>  
      <Text mt="3">Objects</Text>

      <ul>
      {data?.artworkReadOwn?.arObjects &&
        data?.artworkReadOwn?.arObjects.map((arObject) => (
          <chakra.li key={`arObj${arObject.key}`} borderTop="1px solid #fff" listStyleType="none" _last={{
            borderBottom: "1px solid #fff"
          }} lineHeight="2rem">
            <Link
              href={`${moduleConfig.rootPath}/${router.query.aid}/${arObject.id}/update`}
            >
              <a>{arObject.title}</a>
            </Link>
          </chakra.li>
        ))}
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
