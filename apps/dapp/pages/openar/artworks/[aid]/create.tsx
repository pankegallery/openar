
import { useState, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkArObjectForm } from "~/components/modules/forms";
import { ModuleArObjectCreateSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";
import { BeatLoader } from "react-spinners";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useArObjectCreateMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

export const artworkReadOwnQueryGQL = gql`
  query artworkReadOwn($id: Int!) {
    artworkReadOwn(id: $id) {
      id
      title      
    }
  }
`;

const Create = () => {
  const router = useRouter();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)
  const [firstMutation, firstMutationResults] = useArObjectCreateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectCreateSchema),
  });


  const { data, loading, error } = useQuery(
    artworkReadOwnQueryGQL,
    {
      variables: {
        id: parseInt(router.query.aid as string, 10),
      },
    }
  );


  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArObjectCreateSchema>
  ) => {
    setIsFormError(false);
    setIsNavigatingAway(false);
    try {
      if (appUser) {
        const { data, errors } = await firstMutation({
          title: newData.title,
          description: newData.description,
          editionOf: newData.editionOf ?? null,
          orderNumber: newData.orderNumber ?? null,
          askPrice: newData.editionOf ?? null,

          artwork: {
            connect: {
              id: parseInt(router.query.aid as string, 10),
            }
          },
          creator: {
            connect: {
              id: appUser.id,
            },
          },
        });

        if (!errors) {
          successToast();
          setIsNavigatingAway(true);
          router.push(`${moduleConfig.rootPath}/${parseInt(router.query.aid as string, 10)}/${data?.arObjectCreate?.id}/update`);
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

  const trimTitle = (str: string) => (str.length > 13) ? `${str.substr(0,10)}...` : str; 

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title: "Artworks",
    },
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title: data && (data.artworkReadOwn?.title ? trimTitle(data.artworkReadOwn?.title) : <BeatLoader size="10px" color="#fff"/>),
    },
    {
      title: "Create object ",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: moduleConfig.rootPath,
      label: "Cancel",
      userCan: "artworkReadOwn",
      isDisabled: disableNavigation,
    },
    {
      type: "submit",
      isLoading: isSubmitting,
      label: "Save draft",
      userCan: "artworkCreate",
      isDisabled: disableNavigation,
    },
  ];

  const errorMessage = firstMutationResults.error
    ? firstMutationResults?.error?.message
    : "";

  return (
    <>
      <FormNavigationBlock shouldBlock={!isNavigatingAway && isDirty && !isSubmitting} />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage
              isLoading={loading}
              isError={
                !!error || (!error && !loading && !data?.artworkReadOwn)
              }
            >
              {isFormError && (
                <Text
                  width="100%"
                  lineHeight="3rem"
                  px="3"
                  borderBottom="1px solid #fff"
                  color="red.400"
                >
                  Unfortunately, we could not save your object. Please try
                  again in a little bit.
                </Text>
              )}
              <ModuleArtworkArObjectForm
                action="create"
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleArObjectCreateSchema}
              />
            </ModulePage>
          </fieldset>
        </form>
      </FormProvider>
    </>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Create, "artworkCreate");
