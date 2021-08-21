import { authVerifyEmailMutationGQL } from "~/graphql/mutations";

import { useMutation } from "@apollo/client";

export const useAuthVerifyEmailMutation = () => {
  const [mutation, mutationResults] = useMutation(authVerifyEmailMutationGQL);

  // full login function
  const execute = (token: string) => {
    return mutation({
      variables: {
        token,
      },
    });
  };
  return [execute, mutationResults] as const;
};
