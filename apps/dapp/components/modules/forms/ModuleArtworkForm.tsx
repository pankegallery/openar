import { imageDeleteMutationGQL } from "~/graphql/mutations";

import { AspectRatio, Box, Grid } from "@chakra-ui/react";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
} from "~/components/forms";

import { ModuleArtworkArObjectsList } from ".";

import { yupIsFieldRequired } from "../validation";

export const ModuleArtworkForm = ({
  action,
  data,
  errors,
  validationSchema,
  disableNavigation,
  setActiveUploadCounter,
}: {
  action: string;
  data?: any;
  errors?: any;
  validationSchema: any;
  setActiveUploadCounter?: Function;
  disableNavigation?: Function;
}) => {
  const { artworkReadOwn } = data ?? {};

  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };

  return (
    <Grid
      templateColumns={columns}
      templateRows={rows}
      minH="calc(100vh - 4rem)"
    >
      <Box>
        <FieldRow>
          <FieldInput
            name="title"
            id="title"
            type="title"
            label="Title"
            isRequired={yupIsFieldRequired("title", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "What is the title of your artwork?",
            }}
          />
        </FieldRow>
        {/* TODO: remove key field */}
        {action === "update" && <FieldRow>
          <FieldInput
            name="key"
            id="key"
            type="key"
            label="Url key"
            isRequired={yupIsFieldRequired("key", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "What is the url key of your?",
            }}
          />
        </FieldRow>}
        <FieldRow>
          <FieldTextEditor
            id="description"
            type="basic"
            name="description"
            label="Description"
            isRequired={yupIsFieldRequired("description", validationSchema)}
            settings={{
              maxLength: 500,
              defaultValue: artworkReadOwn?.description
                ? artworkReadOwn?.description
                : undefined,
              placeholder: "Please describe your artwork in a few words",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="url"
            id="url"
            type="url"
            label="Url"
            isRequired={yupIsFieldRequired("url", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "Can people find more information somewhere else?",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="video"
            id="video"
            type="video"
            label="Video"
            isRequired={yupIsFieldRequired("video", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "https://vimeo.com/... or https://youtube.com/...",
            }}
          />
        </FieldRow>
      </Box>
      <Box
        w={{ base: "50%", t: "auto" }}
        minH="100%"
        borderLeft="1px solid #fff"
        p="3"
      >
        {action === "create" && (
          <AspectRatio
            ratio={1}
            border="5px dashed var(--chakra-colors-openarGreen-400)"
          >
            <Box textAlign="center" p="10" color="openarGreen.500">
              Please save a draft to unlock image and model upload
            </Box>
          </AspectRatio>
        )}
        {action === "update" && (
          <>
            <FieldImageUploader
              route="image"
              id="heroImage"
              name="heroImage"
              label="Featured Image (leave empty to start with first object)"
              isRequired={yupIsFieldRequired("heroImage", validationSchema)}
              setActiveUploadCounter={setActiveUploadCounter}
              deleteButtonGQL={imageDeleteMutationGQL}
              connectWith={{
                heroImageArtworks: {
                  connect: {
                    id: artworkReadOwn.id,
                  },
                },
              }}
              settings={{
                // minFileSize: 1024 * 1024 * 0.0488,
                maxFileSize: 1024 * 1024 * 5,
                aspectRatioPB: 100, // % bottom padding

                image: {
                  status: artworkReadOwn?.heroImage?.status,
                  id: artworkReadOwn?.heroImage?.id,
                  meta: artworkReadOwn?.heroImage?.meta,
                  alt: `Featured Image`,
                  forceAspectRatioPB: 100,
                  showPlaceholder: true,
                  sizes: "(min-width: 45em) 20v, 95vw",
                },
              }}
            />
          </>
        )}

        {action === "update" && (
          <ModuleArtworkArObjectsList
            {...{
              data,
              errors,
              validationSchema,
              disableNavigation,
              setActiveUploadCounter,
            }}
          />
        )}
      </Box>
    </Grid>
  );
};
export default ModuleArtworkForm;
