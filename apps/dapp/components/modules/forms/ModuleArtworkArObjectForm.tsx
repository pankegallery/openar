import {
  arModelDeleteMutationGQL,
  imageDeleteMutationGQL,
} from "~/graphql/mutations";

import {
  AspectRatio,
  Box,
  Grid,
  useDisclosure,
  Text,
  chakra,
  FormLabel,
  Input
} from "@chakra-ui/react";
import pick from "lodash/pick";
import { useFormContext } from "react-hook-form";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
  FieldCheckbox,
  FieldSwitch,
  FieldModelUploader
} from "~/components/forms";

import { IncompleteOverlay } from "~/components/frontend";

import { ArObjectStatusEnum } from "~/utils";

import { yupIsFieldRequired } from "../validation";

import { useState } from 'react'

import LeafletMap from "../map";

export const ModuleArtworkArObjectForm = ({
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

  const { arObjectReadOwn } = data ?? {};

  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };

  const uploadedFiles = arObjectReadOwn?.arModels.reduce(
    (acc, model) => ({
      ...acc,
      [model.type]: pick(model, ["status", "meta", "id"]),
    }),
    {}
  );

  const [geolocationToggleEnabled, setGeolocationToggleEnabled] = useState(false)

  console.log("Data is: ", data)

  const [latitude, setLatitude] = useState(52.5164)
  const [longitude, setLongitude] = useState(13.4024)

  const onCenterChange = (lat, lng) => {
    setLatitude(lat)
    setLongitude(lng)
  }

  const {
    formState,
    register,
    setValue,
  } = useFormContext();

  const disableFormFields =
    action !== "create" &&
    ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
      arObjectReadOwn?.status
    );
  return (
    <>
      <Grid
        templateColumns={columns}
        templateRows={rows}
        minH="calc(100vh - 4rem)"
      >
        <Box>
          <FieldRow>
            <FieldInput
              name="title2"
              id="title"
              type="title"
              label="Object title"
              isDisabled={disableFormFields}
              isRequired={yupIsFieldRequired("title", validationSchema)}
              settings={{
                // defaultValue: data.abc.key
                placeholder: "Insert title here…",
              }}
            />
          </FieldRow>
          <FieldRow>
            <Box px="6" pt="3" className="muted">
              <Text textStyle="label">Artwork description</Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.artworkReadOwn.description,
                }}
              />
            </Box>

            <FieldTextEditor
              id="description"
              type="basic"
              name="description"
              label="Additional Object description"
              isDisabled={disableFormFields}
              isRequired={yupIsFieldRequired("description", validationSchema)}
              settings={{
                maxLength: 500,
                defaultValue: arObjectReadOwn?.description
                  ? arObjectReadOwn?.description
                  : undefined,
                placeholder: "Insert object details…",
              }}
            />
          </FieldRow>
          <FieldRow>
            <FieldSwitch
              name="geolocationEnabled"
              id="geolocationEnabled"
              label="Restrict access based on geolocation"
              isDisabled={disableFormFields}
              isRequired={yupIsFieldRequired("title", validationSchema)}
              settings={{
                // defaultValue: data.abc.key
                placeholder: "Insert title here…",
              }}
              onChangeHandler={(e) => {
                console.log("onChange", e.target.checked)
                setGeolocationToggleEnabled(e.target.checked)
              }}
            />
            <Text ml="6">
              Enabling this toggle will only allow users within 10 meters of the lat/lon coordinates you specify to view your object in AR.<br/>
              Users at a different location (or those who choose not to share the location with openAR) will still be able to see the object, but not place it in the world.
            </Text>

            { geolocationToggleEnabled &&

               <Text ml="6">
                  Move the map until the marker is placed at your chosen location.<br/>                  
                  Your current coordinates are: {latitude.toFixed(6)} (lat), {longitude.toFixed(6)} (lng)
                </Text> 
            }
            { geolocationToggleEnabled &&
              <LeafletMap
                lat={latitude}
                lng={longitude}
                onCenterChange={onCenterChange}
              />
            }
          </FieldRow>

        </Box>
        <Box
          w={{ base: "50%", t: "auto" }}
          minH="100%"
          borderLeft="1px solid #fff"
          position="relative"
        >
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
              align="top"
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
            <>
              <Box p="6" borderBottom="1px solid #fff">
                <FieldRow>
                  <FieldImageUploader
                    route="image"
                    id="heroImage"
                    name="heroImage"
                    label="Poster image"
                    isRequired={yupIsFieldRequired(
                      "heroImage",
                      validationSchema
                    )}
                    setActiveUploadCounter={setActiveUploadCounter}
                    canDelete={
                      arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT
                    }
                    deleteButtonGQL={imageDeleteMutationGQL}
                    shouldSetFormDirtyOnDelete={true}
                    isDisabled={disableFormFields}
                    connectWith={{
                      heroImageArObjects: {
                        connect: {
                          id: arObjectReadOwn?.id,
                        },
                      },
                    }}
                    settings={{
                      // minFileSize: 1024 * 1024 * 0.0488,
                      maxFileSize: 1024 * 1024 * 5,
                      aspectRatioPB: 100, // % bottom padding

                      image: {
                        status: arObjectReadOwn?.heroImage?.status,
                        id: arObjectReadOwn?.heroImage?.id,
                        meta: arObjectReadOwn?.heroImage?.meta,
                        alt: `Poster Image`,
                        forceAspectRatioPB: 100,
                        showPlaceholder: true,
                        sizes: "(min-width: 45em) 20v, 95vw",
                      },
                      helpText:
                        "The poster image is shown for each image of the artwork",
                    }}
                  />
                </FieldRow>
              </Box>
              <Box p="6" borderBottom="1px solid #fff">
                <FieldRow>
                  <FormLabel opacity={disableFormFields ? 0.4 : 1}>
                    AR models
                  </FormLabel>
                  <Text fontSize="xs" className="muted">
                    Add one model each for iOS and Android. We recommend to upload models smaller than 10Mb
                  </Text>
                  <Grid
                    w="100%"
                    mt="3"
                    templateRows="1fr"
                    templateColumns={{
                      base: "100%",
                      t: "1fr 1fr",
                    }}
                    gap="4"
                  >
                    <FieldModelUploader
                      route="model"
                      id="modelGlb"
                      type="glb"
                      name="modelGlb"
                      label=".glb/.gltf"
                      isRequired={yupIsFieldRequired(
                        "modelGlb",
                        validationSchema
                      )}
                      isDisabled={disableFormFields}
                      setActiveUploadCounter={setActiveUploadCounter}
                      canDelete={
                        arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT
                      }
                      deleteButtonGQL={arModelDeleteMutationGQL}
                      connectWith={{
                        arObject: {
                          connect: {
                            id: arObjectReadOwn?.id,
                          },
                        },
                      }}
                      settings={{
                        // minFileSize: 1024 * 1024 * 0.0488,
                        maxFileSize: 1024 * 1024 * 50,
                        accept: ".glb",
                        model: {
                          status: uploadedFiles?.glb?.status,
                          id: uploadedFiles?.glb?.id,
                          meta: uploadedFiles?.glb?.meta,
                        },
                      }}
                    />
                    <FieldModelUploader
                      route="model"
                      id="modelUsdz"
                      type="usdz"
                      name="modelUsdz"
                      label=".usdz"
                      isRequired={yupIsFieldRequired(
                        "modelUsdz",
                        validationSchema
                      )}
                      isDisabled={disableFormFields}
                      setActiveUploadCounter={setActiveUploadCounter}
                      canDelete={
                        arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT
                      }
                      deleteButtonGQL={arModelDeleteMutationGQL}
                      connectWith={{
                        arObject: {
                          connect: {
                            id: arObjectReadOwn?.id,
                          },
                        },
                      }}
                      settings={{
                        // minFileSize: 1024 * 1024 * 0.0488,
                        maxFileSize: 1024 * 1024 * 50,
                        accept: ".usdz",
                        model: {
                          status: uploadedFiles?.usdz?.status,
                          id: uploadedFiles?.usdz?.id,
                          meta: uploadedFiles?.usdz?.meta,
                        },
                      }}
                    />
                  </Grid>
                </FieldRow>
              </Box>
            </>
          )}
        </Box>
      </Grid>
    </>
  );
};
export default ModuleArtworkArObjectForm;
