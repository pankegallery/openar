import { useState, useEffect, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@apollo/client";
import { Divider, Text } from "@chakra-ui/react";
import Router from "next/router";

import { LayoutOpenAR } from "~/components/app";
import {
  FormNavigationBlock,
  FormScrollInvalidIntoView,
} from "~/components/forms";
import { moduleProfileConfig as moduleConfig } from "~/components/modules/config";
import { ModuleProfileUpdateForm } from "~/components/modules/forms";
import { UserProfileUpdateValidationSchema } from "~/components/modules/validation";
// import { RestrictPageAccess } from "~/components/utils";

import { useUserProfileUpdateMutation } from "~/hooks/mutations";
import { filteredOutputByWhitelistNullToUndefined } from "~/utils";
import {
  useAuthentication,
  useTypedDispatch,
  useSuccessfullySavedToast,
} from "~/hooks";
import { userProfileUpdate } from "~/redux/slices/user";

import { userProfileReadQueryGQL } from "~/graphql/queries";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

const Update = () => {
  const dispatch = useTypedDispatch();
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [activeUploadCounter, setActiveUploadCounter] = useState<number>(0);

  const { data, loading, error } = useQuery(userProfileReadQueryGQL, {
    variables: {
      id: (appUser?.id ?? -1),
    },
  });

  const [firstMutation, firstMutationResults] = useUserProfileUpdateMutation();
  const [isFormError, setIsFormError] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const disableForm = firstMutationResults.loading;

  // TODO: there should be a nicer way to use react hook form in TS
  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(UserProfileUpdateValidationSchema) as any,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  useEffect(() => {
    reset(
      filteredOutputByWhitelistNullToUndefined(data?.userProfileReadById, [
        "pseudonym",
        "email",
        "bio",
        "url",
        "acceptedTerms",
      ])
    );
  }, [reset, data]);

  const onSubmit = async (
    newData: yup.InferType<typeof UserProfileUpdateValidationSchema>
  ) => {
    setIsFormError(false);
    try {
      if (appUser) {
        const { errors } = await firstMutation(appUser?.id, {
          pseudonym: newData.pseudonym ?? "",
          email: newData.email ?? "",
          bio: newData.bio ?? "",
          url: newData.url ?? "",
          acceptedTerms: !!newData.acceptedTerms,
        });

        if (!errors) {
          dispatch(
            userProfileUpdate({
              pseudonym: newData.pseudonym ?? "",
              email: newData.email,
              emailVerified:
                data?.userProfileReadById?.email &&
                newData?.email &&
                data?.userProfileReadById?.email !== newData?.email
                  ? "no"
                  : undefined,
            })
          );
          successToast();
          setIsNavigatingAway(true);
          Router.push(moduleConfig.rootPath);
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
      title: "Profile",
    },
    {
      title: "Update profile",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: moduleConfig.rootPath,
      label: "Cancel",
      userCan: "profileUpdate",
      isDisabled: disableNavigation || activeUploadCounter > 0,
    },
    {
      type: "submit",
      isLoading: isSubmitting,
      label: "Update",
      userCan: "profileUpdate",
      isDisabled: disableNavigation || activeUploadCounter > 0,
    },
  ];

  const errorMessage = firstMutationResults.error
    ? firstMutationResults?.error?.message
    : "";

  return (
    <>
      <FormNavigationBlock
        shouldBlock={
          (isDirty && !isSubmitting && !isNavigatingAway) ||
          activeUploadCounter > 0
        }
      />
      <FormProvider {...formMethods}>
        <FormScrollInvalidIntoView hasFormError={isFormError} />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage isLoading={loading} isError={!!error}>
              {isFormError && (
                <Text
                  width="100%"
                  p="6"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  {errorMessage}
                </Text>
              )}
              <ModuleProfileUpdateForm
                data={data?.userProfileReadById}
                setActiveUploadCounter={setActiveUploadCounter}
                disableNavigation={setDisableNavigation}
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

// export default RestrictPageAccess(Update, "profileUpdate");
export default Update;
