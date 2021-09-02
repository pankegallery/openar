import { useEffect, useState } from "react";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { OpenAR, addresses } from "@openar/crypto";
import { MediaFactory } from "@openar/contracts";

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
  const [signatureError, setSignatureError] = useState<string | undefined>(
    undefined
  );

  const { library, chainId, account, active, error, connector } =
    useWeb3React<Web3Provider>();

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

  console.log("CHAIN ID", chainId, account);
  console.log(addresses.development.media);
  connector.getChainId().then((data) => {
    console.log(data);
  });

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
  // TODO: https://github.com/MetaMask/test-dapp/blob/main/src/index.js
  // TODO: https://github.com/dmihal/eth-permit
  // https://stackoverflow.com/questions/46611117/how-to-authenticate-and-send-contract-method-using-web3-js-1-0
  useEffect(() => {
    if (
      mintObject &&
      mintSignature.trim() === "" &&
      account &&
      active &&
      library.provider
    ) {
      mintDisclosure.onOpen();

      console.log(library.getSigner(account));
      const openAR = new OpenAR(
        library.getSigner(account),
        chainId,
        addresses.development.media,
        addresses.development.market
      );

      console.log("network:", library.network);

      const test = async () => {
        try {
          console.log("test");
          const tx1 = await openAR.media.marketContract();
          console.log("test2", tx1);
          const tx2 = await openAR.fetchTotalMedia();
          // console.log(tx);
          console.log("test3", tx2);
        } catch (err) {
          console.log(err);
        }
      };

      test();

      //   // library
      //   //           .getSigner(account)
      //   //           .signMessage('👋')
      //   //           .then((signature: any) => {
      //   //             window.alert(`Success!\n\n${signature}`)
      //   //           })
      //   //           .catch((error: any) => {
      //   //             window.alert('Failure!' + (error && error.message ? `\n\n${error.message}` : ''))
      //   //           })

      //   // Market: 0x53b56c2dB09865a21B3242B8Bd5Fae00a0dFf119
      //   // Media: 0x588352A251aAC2EC0e868fC13612Fa2edd604f23
      //   const msgParams = JSON.stringify({
      //     domain: {
      //       // Defining the chain aka Rinkeby testnet or Ethereum Main Net
      //       chainId: 50,
      //       // Give a user friendly name to the specific contract you are signing for.
      //       name: 'openAr',
      //       // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
      //       verifyingContract: '0x588352A251aAC2EC0e868fC13612Fa2edd604f23',
      //       // Just let's you know the latest version. Definitely make sure the field name is correct.
      //       version: '1',
      //     },

      //     // Defining the message signing data content.
      //     message: {
      //       /*
      //        - Anything you want. Just a JSON Blob that encodes the data you want to send
      //        - No required fields
      //        - This is DApp Specific
      //        - Be as explicit as possible when building out the message schema.
      //       */
      //       contents: 'Hello, Bob!',
      //       attachedMoneyInEth: 4.2,
      //       from: {
      //         name: 'Cow',
      //         wallets: [
      //           '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      //           '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
      //         ],
      //       },
      //       to: [
      //         {
      //           name: 'Bob',
      //           wallets: [
      //             '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      //             '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
      //             '0xB0B0b0b0b0b0B000000000000000000000000000',
      //           ],
      //         },
      //       ],
      //     },
      //     // Refers to the keys of the *types* object below.
      //     primaryType: 'Mail',
      //     types: {
      //       // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
      //       EIP712Domain: [
      //         { name: 'name', type: 'string' },
      //         { name: 'version', type: 'string' },
      //         { name: 'chainId', type: 'uint256' },
      //         { name: 'verifyingContract', type: 'address' },
      //       ],
      //       // Not an EIP712Domain definition
      //       Group: [
      //         { name: 'name', type: 'string' },
      //         { name: 'members', type: 'Person[]' },
      //       ],
      //       // Refer to PrimaryType
      //       Mail: [
      //         { name: 'from', type: 'Person' },
      //         { name: 'to', type: 'Person[]' },
      //         { name: 'contents', type: 'string' },
      //       ],
      //       // Not an EIP712Domain definition
      //       Person: [
      //         { name: 'name', type: 'string' },
      //         { name: 'wallets', type: 'address[]' },
      //       ],
      //     },
      //   });

      //   library.provider.send({
      //     method: "eth_signTypedData_v4",
      //   });

      //   const sign = await ethereum.request({
      //     method: "eth_signTypedData_v4",
      //     params: [from, JSON.stringify(msgParams)],
      //   });

      //   library.provider.sendAsync(
      //     {
      //       method: "eth_signTypedData_v4",
      //       params: [
      //         ethersUtils.hexlify(ethersUtils.toUtf8Bytes(toSign)),
      //         account.toLowerCase(),
      //       ],
      //       from: account,
      //     },
      //     async (error, result) => {
      //       if (!error && result?.result) {
      //         await walletLoginLogin(result?.result);
      //       } else {
      //         if (error?.code && error?.code === 4001) {
      //           // TODO: make better
      //           setAwaitingUserInteraction(null);

      //           triggerToast(
      //             "Signature required",
      //             "Please sign the requested signature to be able to logon to our plaform",
      //             "error"
      //           );
      //           await walletDisconnect();
      //         } else {
      //           handleError(error);
      //         }
      //       }
      //     }
      //   );
    }
  }, [
    mintObject,
    mintSignature,
    mintDisclosure,
    account,
    active,
    library.provider,
  ]);

  console.log("web3 error", error, mintObject);
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
                  isChecked={mintObject}
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
            {!signatureError && (
              <Flex my="6" justifyContent="center">
                <BeatLoader color="#fff" />
              </Flex>
            )}
            <Box>
              <Button onClick={cancelMintSignature}>Cancel</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModuleArtworkArObjectForm;
