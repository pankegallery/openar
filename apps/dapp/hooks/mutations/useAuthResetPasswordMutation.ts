import { authResetPasswordRequestMutationGQL, authResetPasswordMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthResetPasswordRequestMutation = () => {  
  const [mutation, mutationResults] = useMutation(authResetPasswordRequestMutationGQL, {
    onCompleted: (data) => {
      console.log("useChangePasswordMutation complete", data)
    },
  });

  const execute = async (email: string) => {
    return mutation({
      variables: {
        email: email,
      },
    });
  };
  return [execute, mutationResults] as const;
};

export const useAuthResetPasswordMutation = () => {  
  const [mutation, mutationResults] = useMutation(authResetPasswordMutationGQL, {
    onCompleted: (data) => {
      console.log("useChangePasswordMutation complete", data)
    },
  });

  const execute = async (password: string, token: string) => {
    return mutation({
      variables: {
        password: password,
        token: token
      },
    });
  };
  return [execute, mutationResults] as const;
};
