import { authLogoutMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";

export const useAuthLogoutMutation = () => {
  const [mutation, mutationResults] = useMutation(authLogoutMutationGQL, {
    // onCompleted: async (data) => {
    // },
  });

  // full login function
  const execute = (userId: number) => {
    return mutation({
      variables: {
        userId,
      },
    });
  };
  return [execute, mutationResults] as const;
};
