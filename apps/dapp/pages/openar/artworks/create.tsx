import { useState, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleArtworksConfig as moduleConfig } from "~/components/modules/config";
import { ModuleArtworkForm } from "~/components/modules/forms";
import { ModuleArtworkCreateSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useArtworkCreateMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

const Create = () => {
  const router = useRouter();

  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)
  const [firstMutation, firstMutationResults] = useArtworkCreateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(ModuleArtworkCreateSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleArtworkCreateSchema>
  ) => {
    setIsFormError(false);
    setIsNavigatingAway(false);
    try {
      if (appUser) {
        const { data, errors } = await firstMutation({
          title: newData.title,
          description: newData.description,
          video: newData.video ?? "",
          url: newData.url ?? "",

          creator: {
            connect: {
              id: appUser.id,
            },
          },
        });

        if (!errors) {
          successToast();
          setIsNavigatingAway(true);
          router.push(`${moduleConfig.rootPath}/${data?.artworkCreate?.id}/update`);
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
    },
    {
      title: "Create artwork",
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
            <ModulePage>
              {isFormError && (
                <Text
                  width="100%"
                  lineHeight="3rem"
                  px="3"
                  borderBottom="1px solid #fff"
                  color="red.400"
                >
                  Unfortunately, we could not save your artwork. Please try
                  again in a little bit.
                </Text>
              )}
              <ModuleArtworkForm
                action="create"
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleArtworkCreateSchema}
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
