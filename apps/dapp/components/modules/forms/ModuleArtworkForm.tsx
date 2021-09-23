import { imageDeleteMutationGQL } from "~/graphql/mutations";

import {
  AspectRatio,
  Box,
  Grid,
  chakra,
} from "@chakra-ui/react";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldSwitch,
  FieldImageUploader,
  FormScrollInvalidIntoView
} from "~/components/forms";

import { IncompleteOverlay, ShowUrlAndCopy } from "~/components/frontend";
import { ModuleArtworkArObjectsList } from ".";

import { yupIsFieldRequired } from "../validation";
import { useFormContext } from "react-hook-form";
import { appConfig } from "~/config";

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

  const href = `${appConfig.baseUrl}/a/${data?.artworkReadOwn?.key}/`;
  
  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };

  const { watch } = useFormContext();

  const [isPublic] = watch(["isPublic"]);

  return (
    <Grid
      templateColumns={columns}
      templateRows={rows}
      minH="calc(100vh - 4rem)"
    >
      <FormScrollInvalidIntoView />
      <Box>
        <FieldRow>
          <FieldInput
            name="title"
            id="title"
            type="title"
            label="Artwork title"
            isRequired={yupIsFieldRequired("title", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "Insert artwork title…",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldTextEditor
            id="description"
            type="basic"
            name="description"
            label="Artwork description"
            isRequired={yupIsFieldRequired("description", validationSchema)}
            settings={{
              maxLength: 500,
              defaultValue: artworkReadOwn?.description
                ? artworkReadOwn?.description
                : undefined,
              placeholder: "Please describe your artwork in a few words…",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="url"
            id="url"
            type="url"
            label="Further information"
            isRequired={yupIsFieldRequired("url", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "Can people find more information somewhere else?",
              helpText: "Add URL…",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="video"
            id="video"
            type="video"
            label="Artwork video"
            isRequired={yupIsFieldRequired("video", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder:
                "Add video URL (https://vimeo.com/... or https://youtube.com/...)",
              helpText:
                "Documentation of artwork creation, performances or additional background information",
            }}
          />
        </FieldRow>
        {action === "update" && <Box borderBottom="1px solid #fff">
          <FieldSwitch
            name="isPublic"
            label="Is you artwork public?"
            isRequired={yupIsFieldRequired("isPublic", validationSchema)}
            defaultChecked={artworkReadOwn?.isPublic}            
            hint={
              isPublic ? "Your artwork is visible on openAR" : "Your artwork will be hidden on openAR. You can always access your artwork via:"
            }
          />
          {!isPublic && (
            <Box px="6" pb="6" mt="-1rem">
              <ShowUrlAndCopy url={href} />
            </Box>
          )}
        </Box>}
      </Box>
      <Box
        w={{ base: "50%", t: "auto" }}
        minH="100%"
        borderLeft="1px solid #fff"
        position="relative"
      >
        {/* ---- OVERLAY: Save to upload --- */}
        {action === "create" && (
          <IncompleteOverlay
            headline="Save draft to upload material."
            subline=" Please save as draft to unlock image and model uplodad."
            button={true}
            buttonLabel="Save draft"
            href=""
            height="100%"
            marginLeft="20"
            marginTop="60"
          />
        )}

        {/* ---- BOX: Fake content behind --- */}

        {action === "create" && (
          <>
            <Box p="6" borderBottom="1px solid #fff">
              <chakra.p textStyle="label">Poster image</chakra.p>
              <chakra.p textStyle="small">
                The poster image is shown in artwork streams and exhibitions.
              </chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white"
                mt="6"
                position="static"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
            </Box>
            <Box p="6" borderBottom="1px solid #fff">
              <chakra.p textStyle="label">Artwork objects</chakra.p>
              <chakra.p textStyle="small">
                Click to edit, drag to change order.
              </chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white"
                mt="6"
                position="static"
                display="inline-flex"
                width="48%"
                mr="4%"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
              <AspectRatio
                ratio={1}
                display="inline-flex"
                border="4px dashed white"
                mt="6"
                position="static"
                width="48%"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
            </Box>
          </>
        )}

        {action === "update" && (
          <Box borderBottom="1px solid #fff" p="6">
            <FieldImageUploader
              route="image"
              id="heroImage"
              name="heroImage"
              label="Poster Image"
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
                  alt: `Poster Image`,
                  forceAspectRatioPB: 100,
                  showPlaceholder: true,
                  sizes: "(min-width: 45em) 20v, 95vw",
                },
                helpText:
                  "The poster image is shown in artwork streams and exhibitions. Leave empty to use the first published object’s poster image.",
              }}
            />
          </Box>
        )}
        {action === "update" && (
          <>
            {/* V2: <Box borderBottom="1px solid #fff">
              <FieldRow>
                <FieldSwitch
                  name="multipleObjects"
                  label="Mulitple object"
                  isRequired={yupIsFieldRequired(
                    "multipleObjects",
                    validationSchema
                  )}
                  hint="The artwork consists of multiple objects."
                />
              </FieldRow>
            </Box> */}
            <Box borderBottom="1px solid #fff" p="6">
              <ModuleArtworkArObjectsList
                {...{
                  data,
                  errors,
                  validationSchema,
                  disableNavigation,
                  setActiveUploadCounter,
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Grid>
  );
};
export default ModuleArtworkForm;
