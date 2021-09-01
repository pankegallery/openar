import { useEffect, useState } from "react";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import {
  arModelDeleteMutationGQL,
  imageDeleteMutationGQL,
} from "~/graphql/mutations";

import {
  AspectRatio,
  Box,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  Text,
  Flex,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import pick from "lodash/pick";
import { useFormContext } from "react-hook-form";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
  FieldModelUploader,
  FieldStatusSelect,
  FieldSwitch,
} from "~/components/forms";

import { ArObjectStatusEnum } from "~/utils";

import { yupIsFieldRequired } from "../validation";

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
  const mintDisclosure = useDisclosure();

  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };

  const uploadedFiles = arObjectReadOwn?.arModels.reduce(
    (acc, model) => ({
      ...acc,
      [model.type]: pick(model, ["status", "meta", "id"]),
    }),
    {}
  );
  const [signatureError, setSignatureError] = useState<string | undefined>(undefined);

  const web3context = useWeb3React<Web3Provider>();

  const { watch, register, setValue } = useFormContext();

  const currentStatus = data?.arObjectReadOwn?.status;

  const statusOptions = [
    {
      value: ArObjectStatusEnum.DRAFT,
      label: "Draft",
      isDisabled:
        currentStatus === ArObjectStatusEnum.MINT ||
        currentStatus === ArObjectStatusEnum.MINTING ||
        currentStatus === ArObjectStatusEnum.MINTED,
    },
    {
      value: ArObjectStatusEnum.PUBLISHED,
      label: "Published",
      isDisabled:
        currentStatus === ArObjectStatusEnum.MINT ||
        currentStatus === ArObjectStatusEnum.MINTING ||
        currentStatus === ArObjectStatusEnum.MINTED,
    },
    {
      value: ArObjectStatusEnum.MINT,
      label: "Mint",
    },
  ];

  const [mintObject, mintSignature] = watch(["mintObject", "mintSignature"]);

  const cancelMintSignature = () => {
    setValue("mintObject", false, {
      shouldDirty: true,
    });
    setValue("mintSignature", "", {
      shouldDirty: true,
    });
    mintDisclosure.onClose();
  };

  useEffect(() => {
    if (mintObject && mintSignature.trim() === "") mintDisclosure.onOpen();
  }, [mintObject, mintSignature, mintDisclosure]);

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
              name="title"
              id="title"
              type="title"
              label="Object title"
              isRequired={yupIsFieldRequired("title", validationSchema)}
              settings={{
                // defaultValue: data.abc.key
                placeholder: "What is the title of your artwork?",
              }}
            />
          </FieldRow>
          {action === "update" && (
            <FieldRow>
              <FieldInput
                name="key"
                id="key"
                type="key"
                label="Url key"
                isRequired={yupIsFieldRequired("key", validationSchema)}
                settings={{
                  // defaultValue: data.abc.key
                  placeholder: "What is the url key of your objec?",
                }}
              />
            </FieldRow>
          )}
          {action === "update" && (
            <FieldRow>
              <FieldStatusSelect
                statusEnum={ArObjectStatusEnum}
                status={currentStatus}
                options={statusOptions}
              />
            </FieldRow>
          )}
          <FieldRow>
            <FieldTextEditor
              id="description"
              type="basic"
              name="description"
              label="Additional description"
              isRequired={yupIsFieldRequired("description", validationSchema)}
              settings={{
                maxLength: 500,
                defaultValue: arObjectReadOwn?.description
                  ? arObjectReadOwn?.description
                  : undefined,
                placeholder: "Please describe your artwork in a few words",
              }}
            />
          </FieldRow>
          <FieldRow>
            <FieldInput
              name="askPrice"
              id="askPrice"
              type="askPrice"
              label="Initial ask price"
              isRequired={
                yupIsFieldRequired("askPrice", validationSchema) || mintObject
              }
              settings={{
                // defaultValue: data.abc.key
                placeholder: "How much would you ask for on the first sales",
              }}
            />
          </FieldRow>
          <FieldRow>
            <FieldInput
              name="editionOf"
              id="editionOf"
              type="editionOf"
              label="Editon of"
              isRequired={
                yupIsFieldRequired("editionOf", validationSchema) || mintObject
              }
              settings={{
                // defaultValue: data.abc.key
                placeholder: "How many NFTs of this object should be minted?",
              }}
            />
          </FieldRow>
          <FieldRow>
            <FieldInput
              name="orderNumber"
              id="orderNumber"
              type="orderNumber"
              label="Order Number"
              isRequired={yupIsFieldRequired("orderNumber", validationSchema)}
              settings={{
                // defaultValue: data.abc.key
                placeholder: "The object is number ... in the artwork listing",
              }}
            />
          </FieldRow>
          {action === "update" && (
            <FieldRow>
              <Box borderBottom="1px solid #fff">
                <Box px="3" pt="3" fontSize="sm">
                  Some info about the minting process... In sem urna, aliquam
                  vel consectetur sit amet, pulvinar sit amet lectus. Quisque
                  molestie dapibus libero non pellentesque. Vivamus quam arcu,
                  dictum quis hendrerit eget, lobortis eu felis. Nulla felis
                  velit, ornare ac porttitor ut, rhoncus eu ipsum. Donec auctor
                  efficitur est vel congue.
                </Box>
                <FieldSwitch
                  defaultChecked={mintObject}
                  name="mintObject"
                  label="Mint object"
                  colorScheme="red"
                ></FieldSwitch>

                <input type="hidden" {...register("mintSignature")} />

                {mintObject && mintSignature && mintSignature.trim() && (
                  <Box px="3" pb="3" color="gray.500" fontSize="xs">
                    Signature: {mintSignature}
                  </Box>
                )}
              </Box>
            </FieldRow>
          )}
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
              <FieldRow>
                <FieldImageUploader
                  route="image"
                  id="heroImage"
                  name="heroImage"
                  label="Poster"
                  isRequired={yupIsFieldRequired("heroImage", validationSchema)}
                  setActiveUploadCounter={setActiveUploadCounter}
                  deleteButtonGQL={imageDeleteMutationGQL}
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
                      alt: `Featured Image`,
                      forceAspectRatioPB: 100,
                      showPlaceholder: true,
                      sizes: "(min-width: 45em) 20v, 95vw",
                    },
                  }}
                />
              </FieldRow>
              <FieldRow>
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
                    label="Ar Model (.glb/.gltf)"
                    isRequired={yupIsFieldRequired(
                      "modelGlb",
                      validationSchema
                    )}
                    setActiveUploadCounter={setActiveUploadCounter}
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
                    label="Ar Model (.usdz)"
                    isRequired={yupIsFieldRequired(
                      "modelUsdz",
                      validationSchema
                    )}
                    setActiveUploadCounter={setActiveUploadCounter}
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
            </>
          )}
        </Box>
      </Grid>
      <Modal
        closeOnOverlayClick={false}
        isOpen={mintDisclosure.isOpen}
        onClose={cancelMintSignature}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Signature required</ModalHeader>
          <ModalBody>
            <Text color="white" mb="4">
              Please sign the signature request in your wallet.
            </Text>
            {signatureError && (
              <Text color="openar.error">{signatureError}</Text>
            )}
            {!signatureError && <Flex my="6" justifyContent="center" ><BeatLoader color="#fff" /></Flex>}
            <Box><Button onClick={cancelMintSignature}>Cancel mint</Button></Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModuleArtworkArObjectForm;
