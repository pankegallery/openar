import { authChangePasswordMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthChangePasswordMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation(authChangePasswordMutationGQL, {
    onCompleted: (data) => {
      console.log("useChangePasswordMutation complete", data)
    },
  });

  const execute = async (userId: number, currentPassword: string, newPassword: string) => {
    return mutation({
      variables: {
        userId: userId,
        currentPassword: currentPassword,
        newPassword: newPassword
      },
    });
  };
  return [execute, mutationResults] as const;
};
