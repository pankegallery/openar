import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  Flex,
  Box,
  ModalBody,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import {
  OpenAR,
  addresses,
  generateMintArObjectSignMessageData,
  recoverSignatureFromMintArObject,
  Decimal,
  stringToHexHash,
  numberToBigNumber,
} from "@openar/crypto";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkArObjectMint } from "~/components/modules/forms";
import { ModuleArObjectMintableSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useArObjectMintMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
  isArObjectReadyToMint,
  isArObjectMinting,
} from "~/components/modules";
import { ArObjectStatusEnum } from "~/utils";

// TODO
export const arObjectReadOwnQueryGQL = gql`
  query arObjectReadOwn($id: Int!, $aid: Int!) {
    arObjectReadOwn(id: $id) {
      id
      status
      title
      description
      editionOf
      orderNumber
      askPrice
      key
      # isBanned TODO: make good use of this
      lat
      lng
      # images {
      # }
      arModels {
        id
        type
        meta
        status
      }
      heroImage {
        id
        meta
        status
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

  const mintDisclosure = useDisclosure();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();

  const [isAwaitingSignature, setIsAwaitingSignature] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const [firstMutation, firstMutationResults] = useArObjectMintMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectMintableSchema),
    defaultValues: {
      setInitialAsk: true,
      editionOf: 1,
      askPrice: 0,
      mintSignature: "",
    },
  });
  const { handleSubmit, setValue, watch, getValues } = formMethods;

  const formDataQuery = useQuery(arObjectReadOwnQueryGQL, {
    variables: {
      id: parseInt(router.query.oid as string, 10),
      aid: parseInt(router.query.aid as string, 10),
    },
  });

  const [signatureError, setSignatureError] = useState<string | undefined>(
    undefined
  );

  const { library, chainId, account, active, error, connector } =
    useWeb3React<Web3Provider>();

  const cancelMintSignature = () => {
    setValue("mintSignature", "", {
      shouldDirty: false,
    });
    setIsAwaitingSignature(false);
    mintDisclosure.onClose();
  };

  let openAR: OpenAR;
  if (library && account)
    openAR = new OpenAR(library.getSigner(account), chainId);

  const signMintRequest = async () => {
    if (!openAR || !appUser) {
      setIsFormError(true);
      return;
    }

    setSignatureError(undefined);
    setIsFormError(false);
    setIsNavigatingAway(false);

    const deadlineBN = openAR.createDeadline(60 * 60 * 24);
    const nonceBN = numberToBigNumber(new Date().getTime());

    const awKeyHash = stringToHexHash(formDataQuery?.data?.artworkReadOwn?.key);
    const objKeyHash = stringToHexHash(
      formDataQuery?.data?.arObjectReadOwn?.key
    );
    const messageData = generateMintArObjectSignMessageData(
      awKeyHash,
      objKeyHash,
      numberToBigNumber(getValues("editionOf")),
      getValues("setInitialAsk"),
      Decimal.new(getValues("askPrice")),
      nonceBN,
      deadlineBN,
      openAR.eip712Domain()
    );

    const msgParams = JSON.stringify(messageData);

    var params = [account.toLowerCase(), msgParams];

    library
      .send("eth_signTypedData_v4", params)
      .then((signature) => {
        recoverSignatureFromMintArObject(
          awKeyHash,
          objKeyHash,
          numberToBigNumber(getValues("editionOf")),
          getValues("setInitialAsk"),
          Decimal.new(getValues("askPrice")),
          nonceBN,
          deadlineBN,
          openAR.eip712Domain(),
          signature
        )
          .then(async (recovered) => {
            const newData = getValues();

            const { errors } = await firstMutation(
              parseInt(router.query.oid as string, 10),
              {
                editionOf: newData.editionOf ?? 1,
                askPrice: newData.askPrice ?? 0,
                setInitialAsk: !!newData.setInitialAsk,
                mintSignature: {
                  signature,
                  deadline: deadlineBN.toString(),
                  nonce: nonceBN.toString(),
                },
              }
            );

            if (!errors) {
              successToast();
              setIsNavigatingAway(true);
              cancelMintSignature();
              router.push(
                `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`
              );
            } else {
              setIsFormError(true);
            }
          })
          .catch((err) => {
            setSignatureError("Sign failed. Please try again.");
            console.error(err);
          });
      })
      .catch((err) => {
        setSignatureError(err.message);
      });
  };

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArObjectMintableSchema>
  ) => {};

  // TODO: make more general
  const trimTitle = (str: string) =>
    str.length > 13 ? `${str.substr(0, 10)}...` : str;

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`,
      title:
        formDataQuery?.data &&
        (formDataQuery?.data?.artworkReadOwn?.title ? (
          trimTitle(formDataQuery?.data?.artworkReadOwn?.title)
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
    {
      type: "button",
      isLoading: isAwaitingSignature,
      onClick: async () => {
        setIsAwaitingSignature(true);
        mintDisclosure.onOpen();

        await signMintRequest();
      },
      label: "Mint",
      isDisabled: !ModuleArObjectMintableSchema.isValidSync(watch()),
      userCan: "artworkUpdateOwn",
    },
  ];

  const isReadyToMint =
    formDataQuery?.data && isArObjectReadyToMint(formDataQuery?.data);

  useEffect(() => {
    if (
      !isAwaitingSignature &&
      !isNavigatingAway &&
      formDataQuery?.data &&
      isArObjectMinting(formDataQuery?.data)
    )
      router.replace(
        `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`
      );
  }, [formDataQuery, isAwaitingSignature, router]);

  return (
    <>
      <FormNavigationBlock
        shouldBlock={!isNavigatingAway && isAwaitingSignature}
      />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage
              isLoading={formDataQuery?.loading}
              isError={
                !!formDataQuery?.error ||
                (!formDataQuery?.error &&
                  !formDataQuery?.loading &&
                  !formDataQuery?.data?.arObjectReadOwn)
              }
            >
              {!isReadyToMint && !isNavigatingAway && (
                <Text
                  width="100%"
                  p="6"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  It looks like your object is not ready to be minted please
                  ensure that artwork and object are published, neccessary
                  fields are filled in, and all assets are uploaded
                </Text>
              )}

              {isFormError && (
                <Text
                  width="100%"
                  p="6"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  Unfortunately, we could not save your object. Please try again
                  in a little bit.
                </Text>
              )}

              {(isReadyToMint || isNavigatingAway) && (
                <ModuleArtworkArObjectMint
                  action="update"
                  data={formDataQuery?.data}
                  awaitingSignature={isAwaitingSignature}
                  validationSchema={ModuleArObjectMintableSchema}
                />
              )}
            </ModulePage>
          </fieldset>
        </form>
      </FormProvider>
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
          <ModalBody pb="6">
            <Text color="white" mb="4">
              Please confirm to mint your object{" "}
              <chakra.span fontWeight="bold" color="gray.400">
                {formDataQuery?.data?.arObjectReadOwn?.title}
              </chakra.span>{" "}
              as an edition of{" "}
              <chakra.span fontWeight="bold" color="gray.400">
                {getValues("editionOf")}
              </chakra.span>
              {getValues("setInitialAsk") ? (
                <>
                  {" "}
                  with an intitial ask of{" "}
                  <chakra.span fontWeight="bold" color="gray.400">
                    {getValues("askPrice").toFixed(2)}
                  </chakra.span>{" "}
                  xDai
                </>
              ) : (
                <></>
              )}{" "}
              by giving the signature in your wallet.
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

Update.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Update, "artworkUpdateOwn");
