import { imageDeleteMutationGQL } from "~/graphql/mutations";

import { AspectRatio, Box, Grid, chakra, FormLabel, Flex, Button } from "@chakra-ui/react";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldSwitch,
  FieldImageUploader,
} from "~/components/forms";

import { IncompleteOverlay } from "~/components/frontend";
import { ModuleArtworkArObjectsList } from ".";

import { MdContentCopy } from "react-icons/md";

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
              helptext: "Add URL…",
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
              placeholder: "Add video URL (https://vimeo.com/... or https://youtube.com/...)",
              helptext: "Documentation of artwork creation, performances or additional background information",
            }}
          />
        </FieldRow>
        <Box
          borderBottom="1px solid #fff">
          <FieldSwitch
            name="private"
            id="private"
            label="Artwork is private"
            isRequired={yupIsFieldRequired("private", validationSchema)}
            isChecked
            hint="Showcase and sell your artwork through this link:"
          />
          <chakra.p p="6" pt="0" mt="-4"
            sx={{
              "svg": {
                display: "inline-block",
                marginTop: "-0.2rem",
              }
            }}>
            <chakra.span textStyle="label" className="muted" mr="2">Link to artwork</chakra.span>
            <chakra.span mr="2">https://www.openar.art/a/0x87dsfs0d98fs09df8</chakra.span>

            <MdContentCopy />
          </chakra.p>
        </Box>
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
            <Box
              p="6"
              borderBottom="1px solid #fff"
            >
              <chakra.p textStyle="label">Featured image</chakra.p>
              <chakra.p textStyle="small">The featured image is shown in artwork streams and exhibitions.</chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white" mt="6"
                position="static"
              >
                <Box textAlign="center" position="static">
                </Box>
              </AspectRatio>
            </Box>
            <Box
              p="6"
              borderBottom="1px solid #fff"
            >
              <chakra.p textStyle="label">Artwork objects</chakra.p>
              <chakra.p textStyle="small">Click to edit, drag to change order.</chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white" mt="6"
                position="static"
                display="inline-flex"
                width="48%"
                mr="4%"
              >
                <Box textAlign="center" position="static">
                </Box>
              </AspectRatio>
              <AspectRatio
                ratio={1}
                display="inline-flex"
                border="4px dashed white" mt="6"
                position="static"
                display="inline-flex"
                width="48%"
              >
                <Box textAlign="center" position="static">
                </Box>
              </AspectRatio>
            </Box>
          </>
        )}

        {action === "update" && (

          <Box borderBottom="1px solid #fff"
          p="6">
            <FieldImageUploader
              route="image"
              id="heroImage"
              name="heroImage"
              label="Featured Image"
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
                helptext: "The featured image is shown in artwork streams and exhibitions. Leave empty to use the first object’s featured image."
              }}
            />
          </Box>
        )}
        {action === "update" && (
          <>
            <Box
              borderBottom="1px solid #fff">
              <FieldRow>
                <FieldSwitch
                  name="multipleObjects"
                  id="multipleObjects"
                  label="Mulitple object"
                  isRequired={yupIsFieldRequired("private", validationSchema)}
                  hint="The artwork consists of multiple objects."
                />
              </FieldRow>
            </Box>
            <Box borderBottom="1px solid #fff"
          p="6">
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
