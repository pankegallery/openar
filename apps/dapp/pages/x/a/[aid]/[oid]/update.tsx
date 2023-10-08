import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Router, { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import Head from "next/head";
import { LayoutOpenAR } from "~/components/app";
import {
  FormNavigationBlock,
  FormScrollInvalidIntoView,
} from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import {
  ModuleArtworkArObjectForm,
  ModuleArObjectNFTForm,
  ModuleDeleteButton,
} from "~/components/modules/forms";
import { ModuleArObjectUpdateSchema } from "~/components/modules/validation";
// import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";
import pick from "lodash/pick";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import {
  useArObjectUpdateMutation,
  useArObjectDeleteMutation,
} from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import {
  filteredOutputByWhitelist,
  ArObjectStatusEnum,
  ArtworkStatusEnum,
  trimStringToLength,
} from "~/utils";

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
      setInitialAsk
      key
      # isBanned TODO: make good use of this
      lat
      lng
      isGeolocationEnabled
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
      key
      title
      description
      status
    }
  }
`;

const isArObjectFormValid = (data, errors, getValues) => {
  if (!data || !data.arObjectReadOwn) return;

  const uploadedFiles = data.arObjectReadOwn?.arModels.reduce(
    (acc, model) => ({
      ...acc,
      [model.type]: pick(model, ["status", "meta", "id"]),
    }),
    {}
  );

  const checkValues = {
    ...getValues(),
    heroImage: data.arObjectReadOwn?.heroImage?.id,
    modelGlb: uploadedFiles?.glb?.id,
    modelUsdz: uploadedFiles?.usdz?.id,
  };

  return (
    Object.keys(errors).length === 0 &&
    ModuleArObjectUpdateSchema.isValidSync(checkValues)
  );
};

const Update = () => {
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [activeUploadCounter, setActiveUploadCounter] = useState<number>(0);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const [couldMint, setCouldMint] = useState(false);
  const [firstMutation, firstMutationResults] = useArObjectUpdateMutation();
  const [deleteMutation, deleteMutationResults] = useArObjectDeleteMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;
  const router = useRouter();

  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectUpdateSchema) as any,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = formMethods;

  const { data, loading, error } = useQuery(arObjectReadOwnQueryGQL, {
    skip: !router?.query?.oid || !router?.query?.aid,
    variables: {
      id: parseInt(router.query.oid as string, 10),
      aid: parseInt(router.query.aid as string, 10),
    },
  });

  useEffect(() => {
    if (!data || !data.arObjectReadOwn) return;

    reset({
      ...filteredOutputByWhitelist(data.arObjectReadOwn, [
        "title",
        "description",
        "status",
        "isGeolocationEnabled",
        "lat",
        "lng"
      ]),
    });
  }, [reset, data]);

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArObjectUpdateSchema>
  ) => {
    setIsFormError(false);
    setIsNavigatingAway(false);
    try {
      console.log("Form on submit: ", newData)
      if (appUser) {
        const { data, errors } = await firstMutation(
          parseInt(router.query.oid as string, 10),
          {
            title: newData.title,
            description: newData.description,
            status: newData.status ?? null,
            lat: newData.isGeolocationEnabled ? newData.lat : null,
            lng: newData.isGeolocationEnabled ? newData.lng : null,
            isGeolocationEnabled: newData.isGeolocationEnabled,
            creator: {
              connect: {
                id: appUser.id,
              },
            },
          }
        );

        if (!errors) {
          successToast();
          setIsNavigatingAway(true);
          Router.push(
            `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`
          );
        } else {
          setIsFormError(true);
        }
      } else {
        setIsFormError(true);
      }
    } catch (err) {
      setIsFormError(true);
    }
  };

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title:
        data &&
        (data.artworkReadOwn?.title ? (
          trimStringToLength(data.artworkReadOwn?.title, 13)
        ) : (
          <BeatLoader size="10px" color="#fff" />
        )),
    },
    {
      title: "Update object",
    },
  ];

  useEffect(() => {
    if (isArObjectFormValid(data, errors, getValues)) {
      setCouldMint(true);
    } else {
      setCouldMint(false);
    }
  }, [setCouldMint, getValues, data, errors, isValid]);

  // console.log("App user is: ", appUser)
  const hasEthWallet = (appUser && appUser.ethAddress && (appUser.ethAddress.length > 0))

  // TODO: this makes some trouble on SSR as the buttons look differently
  // as the user can't do thing on the server
  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      label: "Back to artwork",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkReadOwn",
    },
    {
      type: "button",
      isLoading: isSubmitting,
      onClick: () => {
        setValue("status", ArObjectStatusEnum.DRAFT);
        handleSubmit(onSubmit)();
      },
      label:
        data?.arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT
          ? "Save draft"
          : "Unpublish",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      skip: ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
        data?.arObjectReadOwn?.status
      ),
      userCan: "artworkUpdateOwn",
    },
    {
      type: "button",
      isLoading: isSubmitting,
      onClick: () => {
        if (data?.arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT)
          setValue("status", ArtworkStatusEnum.PUBLISHED);
        handleSubmit(onSubmit)();
      },
      label:
        data?.arObjectReadOwn?.status === ArObjectStatusEnum.DRAFT
          ? "Publish"
          : "Save",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkUpdateOwn",
      skip: ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
        data?.arObjectReadOwn?.status
      ),
    },
    // {
    //   type: "button",
    //   isLoading: false,
    //   onClick: async () => {
    //     if (isArObjectFormValid(data, errors, getValues)) {
    //       Router.push(
    //         `${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/check`
    //       );
    //     } else {
    //       setValue("status", ArObjectStatusEnum.PUBLISHED);
    //       handleSubmit(onSubmit)();
    //     }
    //   },
    //   label: "Mint as NFT",
    //   isDisabled:
    //     !(
    //       data?.artworkReadOwn?.status === ArtworkStatusEnum.PUBLISHED ||
    //       data?.artworkReadOwn?.status === ArtworkStatusEnum.HASMINTEDOBJECTS
    //     ) ||
    //     !(data?.arObjectReadOwn?.status === ArObjectStatusEnum.PUBLISHED) ||
    //     !couldMint ||
    //     disableNavigation ||
    //     !hasEthWallet ||
    //     activeUploadCounter > 0,
    //   skip: ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
    //     data?.arObjectReadOwn?.status
    //   ),
    //   hasTooltip: !hasEthWallet,
    //   tooltipText: (hasEthWallet ? "" : "Please connect your ETH wallet in order to mint an NFT"),
    //   userCan: "artworkUpdateOwn",
    // },
  ];

  return (
    <>
      <FormNavigationBlock
        shouldBlock={
          !isNavigatingAway &&
          ((isDirty && !isSubmitting) || activeUploadCounter > 0)
        }
      />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormScrollInvalidIntoView hasFormError={isFormError} />
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage
              isLoading={loading}
              isError={
                !!error || (!error && !loading && !data?.arObjectReadOwn)
              }
            >
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

              <ModuleArObjectNFTForm data={data} />
              <ModuleArtworkArObjectForm
                action="update"
                data={data}
                setActiveUploadCounter={setActiveUploadCounter}
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleArObjectUpdateSchema}
              />
              {[
                ArObjectStatusEnum.DRAFT,
                ArObjectStatusEnum.PUBLISHED,
              ].includes(data?.arObjectReadOwn?.status) && (
                <ModuleDeleteButton
                  buttonLabel="Delete object"
                  dZADRequireTextualConfirmation={true}
                  dZADTitle="Delete object"
                  dZADMessage="Do you really want to delete the object and its AR model(s) and image?"
                  dZADOnYes={async () => {
                    setIsNavigatingAway(false);

                    const { errors } = await deleteMutation(
                      parseInt(router.query.oid as string)
                    );

                    if (!errors) {
                      successToast();
                      setIsNavigatingAway(true);
                      Router.push(
                        `${moduleConfig.rootPath}/${router.query.aid}/update`
                      );
                    } else {
                      setIsFormError(true);
                    }
                  }}
                />
              )}
            </ModulePage>
          </fieldset>
        </form>
      </FormProvider>
    </>
  );
};

Update.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

// export default RestrictPageAccess(Update, "artworkUpdateOwn");
export default Update;
