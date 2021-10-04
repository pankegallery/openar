import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Router, { useRouter } from "next/router";
import { Text, chakra, useDisclosure } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import {
  OpenAR,
  generateMintArObjectSignMessageData,
  recoverSignatureFromMintArObject,
  Decimal,
  stringToHexHash,
  numberToBigNumber,
} from "@openar/crypto";

import { LayoutOpenAR } from "~/components/app";
import { WalletActionRequired } from "~/components/frontend";
import {
  FormNavigationBlock,
  FormScrollInvalidIntoView,
} from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkArObjectMint } from "~/components/modules/forms";
import { ModuleArObjectMintableSchema } from "~/components/modules/validation";
// import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";

import {
  useAuthentication,
  useSuccessfullySavedToast,
  useWalletLogin,
} from "~/hooks";
import { useArObjectMintMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
  isArObjectReadyToMint,
  isArObjectMinting,
} from "~/components/modules";
import { trimStringToLength } from "~/utils";

export type ModuleArObjectMintableSchemaInputs = {
  mintSignature?: string;
  setInitialAsk: boolean;
  askPrice?: number;
  editionOf: number;
};

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
  const mintDisclosure = useDisclosure();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();

  const [isAwaitingSignature, setIsAwaitingSignature] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const [firstMutation, firstMutationResults] = useArObjectMintMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;
  const router = useRouter();

  // TODO: there should be a nicer way to use react hook form in TS
  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectMintableSchema) as any,
    defaultValues: {
      setInitialAsk: true,
      editionOf: 1,
      askPrice: 0,
      mintSignature: "",
    },
  });
  const { handleSubmit, setValue, watch, getValues } = formMethods;

  const formDataQuery = useQuery(arObjectReadOwnQueryGQL, {
    skip: !router?.query?.oid || !router?.query?.aid,
    variables: {
      id: parseInt(router.query.oid as string, 10),
      aid: parseInt(router.query.aid as string, 10),
    },
  });

  const [signatureError, setSignatureError] = useState<string | undefined>(
    undefined
  );

  const { library, chainId, account } = useWalletLogin();

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
                editionOf: parseInt(newData.editionOf ?? 1),
                askPrice: parseFloat(newData.askPrice ?? 0),
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
              Router.push(
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

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`,
      title:
        formDataQuery?.data &&
        (formDataQuery?.data?.artworkReadOwn?.title ? (
          trimStringToLength(formDataQuery?.data?.artworkReadOwn?.title, 13)
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
      Router.replace(
        `${moduleConfig.rootPath}/${Router.query.aid}/${Router.query.oid}/update`
      );
  }, [formDataQuery, isAwaitingSignature, isNavigatingAway]);

  let askPriceFormatted = getValues("askPrice");
  if (askPriceFormatted) {
    if (typeof askPriceFormatted === "string")
      askPriceFormatted = parseFloat(askPriceFormatted);

    askPriceFormatted = askPriceFormatted.toFixed(2);
  }

  return (
    <>
      <FormNavigationBlock
        shouldBlock={!isNavigatingAway && isAwaitingSignature}
      />
      <FormProvider {...formMethods}>
        <FormScrollInvalidIntoView hasFormError={isFormError} />
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

      <WalletActionRequired
        isOpen={mintDisclosure.isOpen}
        showClose={!!signatureError}
        onClose={cancelMintSignature}
        title="Signature required"
        error={signatureError}
      >
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
                {askPriceFormatted}
              </chakra.span>{" "}
              xDai
            </>
          ) : (
            <></>
          )}{" "}
          by signing the signature request in your wallet.
        </Text>
      </WalletActionRequired>
    </>
  );
};

Update.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

// export default RestrictPageAccess(Update, "artworkUpdateOwn");
export default Update;
