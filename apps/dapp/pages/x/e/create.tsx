import { useState, ReactElement } from "react";
import type * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { Text } from "@chakra-ui/react";

import { LayoutOpenAR } from "~/components/app";
import { FormNavigationBlock } from "~/components/forms";
import { moduleExhibitionsConfig as moduleConfig } from "~/components/modules/config";
import { ModuleExhibitionForm } from "~/components/modules/forms";
import { ModuleExhibitionCreateSchema } from "~/components/modules/validation";
// import { RestrictPageAccess } from "~/components/utils";

import { useAuthentication, useSuccessfullySavedToast } from "~/hooks";
import { useExhibitionCreateMutation } from "~/hooks/mutations";
import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

const Create = () => {
  const [appUser] = useAuthentication();
  const successToast = useSuccessfullySavedToast();
  const [disableNavigation, setDisableNavigation] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const [firstMutation, firstMutationResults] = useExhibitionCreateMutation();
  const [isFormError, setIsFormError] = useState(false);

  const disableForm = firstMutationResults.loading;

  // TODO: there should be a nicer way to use react hook form in TS
  const formMethods = useForm<Record<string, any>>({
    mode: "onTouched",
    resolver: yupResolver(ModuleExhibitionCreateSchema) as any,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = formMethods;

  const onSubmit = async (
    newData: yup.InferType<typeof ModuleExhibitionCreateSchema>
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
          Router.push(
            `${moduleConfig.rootPath}/${data?.exhibitionCreate?.id}/update`
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
    },
    {
      title: "New exhibition",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: "/x/",
      label: "Cancel",
      userCan: "exhibitionReadOwn",
      isDisabled: disableNavigation,
    },
    {
      type: "submit",
      isLoading: isSubmitting,
      label: "Save draft",
      userCan: "exhibitionCreate",
      isDisabled: disableNavigation,
    },
  ];

  return (
    <>
      <FormNavigationBlock
        shouldBlock={!isNavigatingAway && isDirty && !isSubmitting}
      />
      <FormProvider {...formMethods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={disableForm}>
            <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
            <ModulePage>
              {isFormError && (
                <Text
                  width="100%"
                  p="6"
                  borderBottom="1px solid #fff"
                  color="openar.error"
                >
                  Unfortunately, we could not save your exhibition. Please try
                  again in a little bit.
                </Text>
              )}
              <ModuleExhibitionForm
                action="create"
                disableNavigation={setDisableNavigation}
                validationSchema={ModuleExhibitionCreateSchema}
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

// export default RestrictPageAccess(Create, "exhibitionCreate");
export default Create;
