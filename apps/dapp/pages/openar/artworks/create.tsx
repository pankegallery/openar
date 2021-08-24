import { useState, useEffect, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@apollo/client";
import { Divider, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleProfileConfig as moduleConfig } from "~/components/modules/config";
import { ModuleProfileUpdateForm } from "~/components/modules/forms";
import { UserProfileUpdateValidationSchema } from "~/components/modules/validation";
import { RestrictPageAccess } from "~/components/utils";

import { useUserProfileUpdateMutation } from "~/hooks/mutations";
import { filteredOutputByWhitelistNullToUndefined } from "~/utils";
import {
  useAuthentication,
  useTypedDispatch,
  useSuccessfullySavedToast,
} from "~/hooks";
import { userProfileUpdate } from "~/redux/slices/user";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";



const Update = () => {
  const router = useRouter();

  const dispatch = useTypedDispatch();
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);

  const [firstMutation, firstMutationResults] = useUserProfileUpdateMutation();
  const [isFormError, setIsFormError] = useState(false);
  
  const disableForm = firstMutationResults.loading;

  const formMethods = useForm({
    mode: "onTouched",
    resolver: yupResolver(UserProfileUpdateValidationSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const onSubmit = async (
    newData: yup.InferType<typeof UserProfileUpdateValidationSchema>
  ) => {
    setIsFormError(false);
    try {
      if (appUser) {
        const { data, errors } = await firstMutation(
          appUser?.id,
          {
            pseudonym: newData.pseudonym ?? "",
            email: newData.email ?? "",
            bio: newData.bio ?? "",
            url: newData.url ?? "",
          }
        );

        if (!errors) {
          successToast();

          router.push(`${moduleConfig.rootPath}/${data.id}/update`);
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
      label: "Update",
      userCan: "artworkCreate",
      isDisabled: disableNavigation,
    },
  ];

  const errorMessage = firstMutationResults.error ? firstMutationResults?.error?.message : "";

  return (
    <>
      <FormNavigationBlock shouldBlock={isDirty && !isSubmitting} />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage isLoading={loading} isError={!!error}>
              {isFormError && <Text width="100%" lineHeight="3rem" px="3" borderBottom="1px solid #fff" color="red.400">{errorMessage}</Text>}
              <ModuleForm
                action="create"
                data={data}
                validationSchema={ModuleLocationCreateSchema}
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

export default RestrictPageAccess(Update, "artworkCreate");
