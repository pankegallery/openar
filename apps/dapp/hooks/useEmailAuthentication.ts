import { useState, useCallback } from "react";
import Router from "next/router";
import { decode } from "jsonwebtoken";

import user from "~/services/user";
import { getAppUser } from "~/services/authentication";
import { store } from "~/redux";
import { appConfig } from "~/config";
import { useAuthRegisterByEmailMutation } from "./mutations/useAuthRegisterByEmailMutation";
import { useAuthLoginByEmailMutation } from "./mutations/useAuthLoginByEmailMutation"
import { useAuthChangePasswordMutation } from "./mutations/useAuthChangePasswordMutation"
import { useAuthResetPasswordRequestMutation, useAuthResetPasswordMutation } from "./mutations/useAuthResetPasswordMutation";

export function useEmailRegistration() {

  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registerByEmailMutation] = useAuthRegisterByEmailMutation()  

  const registerByEmail = useCallback(
    async (email: string, password: string) => {
      console.log("Register by email: ", email, password)
      setRegistrationError(null);

      const { data, errors } = await registerByEmailMutation(email, password);
  
      try {
        const { tokens } = data?.authRegisterByEmail ?? {};
  
        if (!errors && tokens) {          
  
          const accessToken = tokens?.access?.token;
          if (accessToken) {
            console.log("Has access token: ", accessToken)
            return;
          }         
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unexpected response in registerByEmailMutation");
        }
      } catch (err) {
        setRegistrationError("Unable to register: " + err.toString());
      }
    },
    [
      registerByEmailMutation,
      setRegistrationError,
    ]
  );

  return {
    registerByEmail,
    registrationError
  } as const
}

export function useEmailLogin() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginByEmailLoading, setLoginByEmailLoading] = useState<Boolean>(false)
  const [loginByEmailSuccess, setLoginByEmailSuccess] = useState<Boolean>(false)
  const [loginByEmailMutation] = useAuthLoginByEmailMutation()

  const loginByEmail = useCallback(
    async (email: string, password: string) => {
      setLoginByEmailLoading(true)
      console.log("Login by email: ", email, password)
      setLoginError(null);

      const { data, errors } = await loginByEmailMutation(email, password);

      setLoginByEmailLoading(false)
      console.log("Mutation complete: ", data, errors)
  
      try {
        const { tokens } = data?.authLoginByEmail ?? {};
  
        if (!errors && tokens && tokens?.access?.token) {          
  
          const accessToken = tokens?.access?.token;
          setLoginByEmailSuccess(true)
          console.log("Has access token: ", accessToken)
          return;
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unable to log in");
        }
      } catch (err) {
        console.error("Caught login error: ", err)
        setLoginError("Login failed, please try again... ");
      }
    },
    [
      loginByEmailMutation,
      setLoginError,
      setLoginByEmailLoading,
      setLoginByEmailSuccess
    ]
  )

  return {
    loginByEmail,
    loginError,
    loginByEmailLoading,
    loginByEmailSuccess
  } as const
}

export function useChangePassword() {
  const [updatePasswordError, setUpdatePasswordError] = useState<string | null>(null)
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState<Boolean>(false)
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState<Boolean>(false)
  const [changePasswordMutation] = useAuthChangePasswordMutation()

  const changePassword = useCallback(
    async (userId: number, password: string, newPassword: string) => {
      setUpdatePasswordLoading(true)
      console.log("Updating password: ", password, newPassword)
      setUpdatePasswordError(null)
      setUpdatePasswordSuccess(false)

      const { data, errors } = await changePasswordMutation(userId, password, newPassword)
      console.log("Mutation complete: ", data, errors)

      setUpdatePasswordLoading(false)

      if (!errors) {
        setUpdatePasswordSuccess(true)        
      } else {
        setUpdatePasswordSuccess(false)
        setUpdatePasswordError("Unable to update password, please try again.")
      }
    },
    [
      changePasswordMutation,
      setUpdatePasswordError,
      setUpdatePasswordLoading,
      setUpdatePasswordSuccess
    ]
  )

  return {
    changePassword,
    updatePasswordError,
    updatePasswordLoading,
    updatePasswordSuccess,
    setUpdatePasswordSuccess
  } as const
}

export function useResetPasswordRequest() {
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null)
  const [resetPasswordLoading, setResetPasswordLoading] = useState<boolean>(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false)
  const [resetPasswordRequestMutation] = useAuthResetPasswordRequestMutation()

  const resetPasswordRequest = useCallback(
    async (email: string) => {
      setResetPasswordLoading(true)      
      setResetPasswordError(null)
      setResetPasswordSuccess(false)

      const { data, errors } = await resetPasswordRequestMutation(email)
      console.log("Mutation complete: ", data, errors)

      setResetPasswordLoading(false)

      if (!errors) {
        setResetPasswordSuccess(true)        
      } else {
        setResetPasswordSuccess(false)
        setResetPasswordError("Unable to request a password reset for this email address, please try again.")
      }
    },
    [
      resetPasswordRequestMutation,
      setResetPasswordError,
      setResetPasswordLoading,
      setResetPasswordSuccess
    ]
  )

  return {
    resetPasswordRequest,
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    setResetPasswordSuccess
  } as const
}

export function useResetPassword() {
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null)
  const [resetPasswordLoading, setResetPasswordLoading] = useState<boolean>(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<boolean>(false)
  const [resetPasswordMutation] = useAuthResetPasswordMutation()

  const resetPassword = useCallback(
    async (password: string, token: string) => {
      setResetPasswordLoading(true)      
      setResetPasswordError(null)
      setResetPasswordSuccess(false)

      const { data, errors } = await resetPasswordMutation(password, token)
      console.log("Mutation complete: ", data, errors)

      setResetPasswordLoading(false)

      if (!errors) {
        setResetPasswordSuccess(true)        
      } else {
        setResetPasswordSuccess(false)
        setResetPasswordError("Unable to update password, please request a new link.")
      }
    },
    [
      resetPasswordMutation,
      setResetPasswordError,
      setResetPasswordLoading,
      setResetPasswordSuccess
    ]
  )

  return {
    resetPassword,
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    setResetPasswordSuccess
  } as const
}

