import { useState, useCallback } from "react";
import Router from "next/router";
import { decode } from "jsonwebtoken";

import user from "~/services/user";
import { getAppUser } from "~/services/authentication";
import { store } from "~/redux";
import { appConfig } from "~/config";
import { useAuthRegisterByEmailMutation } from "./mutations/useAuthRegisterByEmailMutation";

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
