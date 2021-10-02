import { useState, ReactElement, useEffect } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";
import { useQuery, gql } from "@apollo/client";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock, FormScrollInvalidIntoView } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import {
  ModuleArtworkForm,
  ModuleDeleteButton,
} from "~/components/modules/forms";
import { ModuleArtworkUpdateSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import {
  useArtworkUpdateMutation,
  useArtworkDeleteMutation,
} from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import { filteredOutputByWhitelist, ArtworkStatusEnum } from "~/utils";

// TODO
export const artworkReadOwnQueryGQL = gql`
  query artworkReadOwn($id: Int!) {
    artworkReadOwn(id: $id) {
      id
      type
      key
      status
      isPublic
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
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const [activeUploadCounter, setActiveUploadCounter] = useState<number>(0);

  const [firstMutation, firstMutationResults] = useArtworkUpdateMutation();
  const [deleteMutation, deleteMutationResults] = useArtworkDeleteMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const router = useRouter();
  
  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(ModuleArtworkUpdateSchema) as any,
    defaultValues: {
      status: ArtworkStatusEnum.DRAFT,
    },
  });
  const {
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const { data, loading, error } = useQuery(artworkReadOwnQueryGQL, {
    variables: {
      id: parseInt(router.query.aid as string, 10),
    },
  });

  useEffect(() => {
    if (!data || !data.artworkReadOwn) return;

    reset({
      ...filteredOutputByWhitelist(data.artworkReadOwn, [
        "title",
        "description",
        "url",
        "video",
        "status",
        "isPublic",
      ]),
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
            isPublic: newData.isPublic,
            creator: {
              connect: {
                id: appUser.id,
              },
            },
          }
        );

        if (!errors) {
          clearErrors();
          successToast();
          setIsNavigatingAway(true);
          router.push(
            `${moduleConfig.rootPath}/${data?.artworkUpdate?.id}/update`
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
      path: "/x/",
      title: "Profile",
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
      to: "/x/",
      label: "Cancel",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkReadOwn",
    },
    {
      type: "button",
      isLoading: isSubmitting,
      onClick: () => {
        setValue("status", ArtworkStatusEnum.DRAFT);
        handleSubmit(onSubmit)();
      },
      label:
        data?.artworkReadOwn?.status === ArtworkStatusEnum.DRAFT
          ? "Save draft"
          : "Unpublish",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      skip: data?.artworkReadOwn?.status === ArtworkStatusEnum.HASMINTEDOBJECTS,
      userCan: "artworkUpdateOwn",
    },
    {
      type: "button",
      isLoading: isSubmitting,
      onClick: () => {
        if (data?.artworkReadOwn?.status === ArtworkStatusEnum.DRAFT)
          setValue("status", ArtworkStatusEnum.PUBLISHED);

        handleSubmit(onSubmit)();
      },
      label: [
        ArtworkStatusEnum.PUBLISHED,
        ArtworkStatusEnum.HASMINTEDOBJECTS,
      ].includes(data?.artworkReadOwn?.status)
        ? "Save"
        : "Publish",
      isDisabled: disableNavigation || activeUploadCounter > 0,
      userCan: "artworkUpdateOwn",
    },
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
        <FormScrollInvalidIntoView hasFormError={isFormError} />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage
              isLoading={loading}
              isError={!!error || (!error && !loading && !data?.artworkReadOwn)}
            >
              {isFormError && (
                <Text
                  width="100%"
                  p="6"
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
              {[ArtworkStatusEnum.DRAFT, ArtworkStatusEnum.PUBLISHED].includes(
                data?.artworkReadOwn?.status
              ) && (
                <ModuleDeleteButton
                  buttonLabel="Delete artwork"
                  dZADRequireTextualConfirmation={true}
                  dZADTitle="Delete artwork"
                  dZADMessage="Do you really want to delete the artwork, objects, ar model, and images?"
                  dZADOnYes={async () => {
                    setIsNavigatingAway(false);

                    const { errors } = await deleteMutation(
                      parseInt(router.query.aid as string)
                    );

                    if (!errors) {
                      clearErrors();
                      successToast();
                      setIsNavigatingAway(true);
                      router.push(`/x/`);
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

export default RestrictPageAccess(Update, "artworkUpdateOwn");
