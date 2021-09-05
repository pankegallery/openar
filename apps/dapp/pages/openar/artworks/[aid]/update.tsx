import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkForm } from "~/components/modules/forms";
import { ModuleArtworkUpdateSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useArtworkUpdateMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import {
  filteredOutputByWhitelist
} from "~/utils";

// TODO
export const artworkReadOwnQueryGQL = gql`
  query artworkReadOwn($id: Int!) {
    artworkReadOwn(id: $id) {
      id
      type
      key
      status
      title
      description
      url
      video
      # isBanned TODO: make good use of this
      lat
      lng
      # images {
      # }
      arObjects {
        id
        key
        title
        orderNumber
        status
        askPrice
        editionOf
        heroImage {
          id
          meta
          status
        }

      }
      # files {
      # }
      heroImage {
        id
        meta
        status
      }
    }
  }
`;

const Update = () => {
  const router = useRouter();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)
  const [activeUploadCounter, setActiveUploadCounter] = useState<number>(0);

  const [firstMutation, firstMutationResults] = useArtworkUpdateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(ModuleArtworkUpdateSchema),
    defaultValues: {
      dates: [],
    },
  });
  const {
    handleSubmit,
    reset,
    clearErrors,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const { data, loading, error } = useQuery(
    artworkReadOwnQueryGQL,
    {
      variables: {
        id: parseInt(router.query.aid as string, 10),
      },
    }
  );

  useEffect(() => {
    if (!data || !data.artworkReadOwn) return;

    reset({
      ...filteredOutputByWhitelist(
        data.artworkReadOwn,
        ["title", "description", "url", "video", "status", "key"]
      )
    });
  }, [reset, data]);

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArtworkUpdateSchema>
  ) => {
    setIsFormError(false);
    setIsNavigatingAway(false);
    try {
      if (appUser) {
        const { data, errors } = await firstMutation(
          parseInt(router.query.aid as string),
          {
          title: newData.title,
          description: newData.description,
          video: newData.video ?? "",
          url: newData.url ?? "",
          status: newData.status ?? "",
          key: newData.key ?? "",

          creator: {
            connect: {
              id: appUser.id,
            },
          },
        });

        if (!errors) {
          clearErrors();
          successToast();
          setIsNavigatingAway(true);
          router.push(`${moduleConfig.rootPath}/${data?.artworkUpdate?.id}/update`);          
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
      path: moduleConfig.rootPath,
      title: "Artworks",
      userCan: "artworkReadOwn",
    },
    {
      title: "Update artwork",
    },
  ];

  // TODO: this makes some trouble on SSR as the buttons look differently 
  // as the user can't do thing on the server 
  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: moduleConfig.rootPath,
      label: "Cancel",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkReadOwn",
    },
    {
      type: "submit",
      isLoading: isSubmitting,
      label: "Update",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkUpdateOwn",
    },
  ];

  return (
    <>
      <FormNavigationBlock shouldBlock={!isNavigatingAway && ((isDirty && !isSubmitting) || activeUploadCounter > 0)} />
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
                  color="openar.error"
                >
                  Unfortunately, we could not save your artwork. Please try
                  again in a little bit.
                </Text>
              )}
              <ModuleArtworkForm
                action="update"
                data={data}
                setActiveUploadCounter={setActiveUploadCounter}
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleArtworkUpdateSchema}
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
