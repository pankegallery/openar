
import { useState, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock, FormScrollInvalidIntoView } from "~/components/forms";
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
import { trimStringToLength } from "~/utils";

export const artworkReadOwnQueryGQL = gql`
  query artworkReadOwn($id: Int!) {
    artworkReadOwn(id: $id) {
      id
      title
      description
    }
  }
`;

const Create = () => {
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)
  const [firstMutation, firstMutationResults] = useArObjectCreateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;
  const router = useRouter();
  
  // TODO: there should be a nicer way to use react hook form in TS 
  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(ModuleArObjectCreateSchema) as any,
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

  const breadcrumb = [
    {
      path: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      title: data && (data.artworkReadOwn?.title ? trimStringToLength(data.artworkReadOwn?.title, 13) : <BeatLoader size="10px" color="#fff"/>),
    },
    {
      title: "Create object ",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: `${moduleConfig.rootPath}/${router.query.aid}/update`,
      label: "Back to artwork",
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
        <FormScrollInvalidIntoView hasFormError={isFormError} />
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
                  p="6"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  Unfortunately, we could not save your object. Please try
                  again in a little bit.
                </Text>
              )}
              <ModuleArtworkArObjectForm
                action="create"
                data={data}
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

export const getStaticProps = () => {
  return {
    props: {}
  }
}

export default RestrictPageAccess(Create, "artworkCreate");
