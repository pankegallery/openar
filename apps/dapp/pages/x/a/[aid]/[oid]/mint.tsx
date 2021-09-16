import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";
import Head from "next/head";
import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkArObjectForm } from "~/components/modules/forms";
import { ModuleArObjectUpdateSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useArObjectUpdateMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import { filteredOutputByWhitelist } from "~/utils";

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
    }
  }
`;

const Update = () => {
  const router = useRouter();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [activeUploadCounter, setActiveUploadCounter] = useState<number>(0);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)

  const [firstMutation, firstMutationResults] = useArObjectUpdateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectUpdateSchema),
    defaultValues: {
      dates: [],
    },
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const { data, loading, error } = useQuery(arObjectReadOwnQueryGQL, {
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
        "orderNumber",
        "editionOf",
        "askPrice",
        "status",
        "key",
      ]),
    });
  }, [reset, data]);

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArObjectUpdateSchema>
  ) => {
    setIsFormError(false);
    setIsNavigatingAway(false);
    try {
      if (appUser) {
        const { data, errors } = await firstMutation(
          parseInt(router.query.oid as string, 10),
          {
            title: newData.title,
            description: newData.description,
            editionOf: newData.editionOf ?? null,
            orderNumber: newData.orderNumber ?? null,
            askPrice: newData.askPrice ?? null,
            status: newData.status ?? null,
            key: newData.key ?? "",
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
          router.push(`${moduleConfig.rootPath}/${router.query.aid}/${router.query.oid}/update`);
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

  // TODO: make more general
  const trimTitle = (str: string) =>
    str.length > 13 ? `${str.substr(0, 10)}...` : str;

  const breadcrumb = [
    {
      path: moduleConfig.rootPath,
      title: "Artworks",
    },
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title:
        data &&
        (data.artworkReadOwn?.title ? (
          trimTitle(data.artworkReadOwn?.title)
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
  ];

  return (
    <>
      <FormNavigationBlock
        shouldBlock={!isNavigatingAway && ((isDirty && !isSubmitting) || activeUploadCounter > 0)}
      />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                  lineHeight="3rem"
                  px="3"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  Unfortunately, we could not save your object. Please try again
                  in a little bit.
                </Text>
              )}
              <ModuleArtworkArObjectForm
                action="update"
                data={data}
                setActiveUploadCounter={setActiveUploadCounter}
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleArObjectUpdateSchema}
              />
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

export default RestrictPageAccess(Update, "artworkUpdateOwn");
