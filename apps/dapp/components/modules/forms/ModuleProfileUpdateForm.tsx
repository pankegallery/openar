import React, { useEffect, useState } from "react"

import { userProfileImageDeleteMutationGQL } from "~/graphql/mutations";

import { 
  Box, 
  Grid, 
  Flex, 
  chakra, 
  Button, 
  useDisclosure, 
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Input,
  Text
 } from "@chakra-ui/react";
import Link from "next/link";

import { useAuthentication } from "~/hooks";
import { useChangePassword } from "~/hooks/useEmailAuthentication"

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldImageUploader,
  FieldSwitch
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

  const [appUser] = useAuthentication();
  const isEmailOnlyAccount = ((!appUser.ethAddress) || (appUser.ethAddress.length < 1))

  const passwordChangeDisclosure = useDisclosure();
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [updatePasswordButtonEnabled, setUpdatePasswordButtonEnabled] = useState(false)

  const { 
    changePassword,
    updatePasswordError,
    updatePasswordLoading,
    updatePasswordSuccess,
    setUpdatePasswordSuccess
  } = useChangePassword()

  useEffect(() => {
    let shouldUpdatePasswordEnable = (currentPassword.length > 0) && (newPassword.length > 0) && (newPassword == newPasswordConfirm)
    if (shouldUpdatePasswordEnable != updatePasswordButtonEnabled) {
      setUpdatePasswordButtonEnabled(shouldUpdatePasswordEnable)
    }


  })

  return (
    <Grid
      templateColumns={columns}
      templateRows={rows}
      minH="calc(100vh - 4rem)"
    >
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
                  I&#39;ve agreed with the platform&#39;s{" "}
                  <Link href="/p/tandc">terms and conditions</Link>
                </>
              }
              defaultChecked={
                !!acceptedTerms
              }
            />
          </FieldRow>
        </Box>

        { isEmailOnlyAccount &&
          <Box p="3" borderTop="1px solid #fff" transform="translateY(-1px)">
            <Flex
              p="3"
              border="2px solid"
              borderColor="openar.error"
              justifyContent="space-between"
              alignItems="center"
            >
              <chakra.span color="openar.error" textStyle="label">Dangerzone</chakra.span>
              <Button onClick={() => {passwordChangeDisclosure.onOpen()}}>
                Change Your Password
              </Button>
            </Flex>
          </Box>
        }        
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

      <Modal
        isOpen={passwordChangeDisclosure.isOpen}
        onClose={() => {
          passwordChangeDisclosure.onClose()
          setCurrentPassword("")
          setNewPassword("")
          setNewPasswordConfirm("")
          setUpdatePasswordSuccess(false)
        }}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Change your password</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">
            <Text color="white" mb="4">
              Type in your current password and your new one below.
            </Text>
            <Stack spacing={1}>
              <Input 
                placeholder='Current password' 
                type="password" 
                size='md' 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />

              <Input 
                placeholder='New password' 
                type="password" 
                size='md' 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />

              <Input 
                placeholder='Repeat the new password' 
                type="password" 
                size='md' 
                value={newPasswordConfirm} 
                onChange={(e) => setNewPasswordConfirm(e.target.value)} 
              />

            </Stack>            

            <Button
                colorScheme="openarWhite"
                justifyContent="space-between"
                width="100%"
                mb="0"
                mt="4"
                size="lg"
                variant="outline"
                isLoading={updatePasswordLoading}
                disabled={!updatePasswordButtonEnabled}
                onClick={async () => {
                  await changePassword(appUser.id, currentPassword, newPassword)
                  setCurrentPassword("")
                  setNewPassword("")
                  setNewPasswordConfirm("")        
                }}
              >
                Change Password
              </Button>

            {updatePasswordError && (
              <Text mt="2" color="openar.error">{updatePasswordError}</Text>
            )}

            {updatePasswordSuccess && (
              <Text mt="2" color="openar.dark">Successfully updated your password, you can now close this pop-up.</Text>
            )}

   
          </ModalBody>
        </ModalContent>
      </Modal>            
    </Grid>
  );
};
export default ModuleProfileUpdateForm;
