import { userProfileImageDeleteMutationGQL } from "~/graphql/mutations";

import { Box, Grid } from "@chakra-ui/react";
import Link from "next/link";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
  FieldSwitch,
  FormScrollInvalidIntoView,
} from "~/components/forms";

import {
  yupIsFieldRequired,
  UserProfileUpdateValidationSchema,
} from "../validation";

export const ModuleProfileUpdateForm = ({
  data,
  errors,
  disableNavigation,
  setActiveUploadCounter,
}: {
  data?: any;
  errors?: any;
  setActiveUploadCounter?: Function;
  disableNavigation?: Function;
}) => {
  const { firstName, lastName, profileImage, bio, acceptedTerms } = data ?? {};

  const columns = { base: "100%", t: "1fr max(33.33%, 350px) " };
  const rows = { base: "auto 1fr", t: "1fr" };

  return (
    <Grid
      templateColumns={columns}
      templateRows={rows}
      minH="calc(100vh - 4rem)"
    >
      <FormScrollInvalidIntoView />
      <Box>
        <FieldRow>
          <FieldInput
            name="pseudonym"
            id="pseudonym"
            type="text"
            label="Pseudonym"
            isRequired={yupIsFieldRequired(
              "email",
              UserProfileUpdateValidationSchema
            )}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "How would you like to be called?",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="email"
            id="email"
            type="text"
            label="Email address"
            isRequired={yupIsFieldRequired(
              "email",
              UserProfileUpdateValidationSchema
            )}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "How can we get hold of you?",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldInput
            name="url"
            id="url"
            type="text"
            label="WWW"
            isRequired={yupIsFieldRequired(
              "url",
              UserProfileUpdateValidationSchema
            )}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "How can people learn more about your work?",
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldTextEditor
            id="bio"
            type="basic"
            name="bio"
            label="Bio"
            isRequired={false}
            settings={{
              defaultValue: bio ? bio : undefined,
              placeholder: "Tell us something about yourself",
            }}
          />
        </FieldRow>
        <Box borderBottom="1px solid #fff">
          <FieldRow>
            <FieldSwitch
              name="acceptedTerms"
              isRequired={yupIsFieldRequired(
                "acceptedTerms",
                UserProfileUpdateValidationSchema
              )}
              label="I accept the terms and conditions"
              hint={
                <>
                  I&#39;ve aggree with the platform&#39;s{" "}
                  <Link href="/p/tandc">terms and conditions</Link>
                </>
              }
              defaultChecked={
                !!acceptedTerms
              }
            />
          </FieldRow>
        </Box>

      </Box>
      <Box
        w={{ base: "50%", t: "auto" }}
        minH="100%"
        borderLeft="1px solid #fff"
        p="3"
      >
        <FieldImageUploader
          route="profileImage"
          id="profileImage"
          name="profileImage"
          label="Profile Image"
          isRequired={yupIsFieldRequired(
            "profileImage",
            UserProfileUpdateValidationSchema
          )}
          deleteButtonGQL={userProfileImageDeleteMutationGQL}
          setActiveUploadCounter={setActiveUploadCounter}
          settings={{
            // minFileSize: 1024 * 1024 * 0.0488,
            maxFileSize: 1024 * 1024 * 5,
            aspectRatioPB: 100, // % bottom padding

            image: {
              status: profileImage?.status,
              id: profileImage?.id,
              meta: profileImage?.meta,
              alt: `${firstName} ${lastName}`,
              forceAspectRatioPB: 100,
              showPlaceholder: true,
              sizes: "(min-width: 45em) 20v, 95vw",
            },
          }}
        />
      </Box>
    </Grid>
  );
};
export default ModuleProfileUpdateForm;
