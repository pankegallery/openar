import { authRequestEmailVerificationEmailMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";

export const useAuthRequestEmailVerificationEmail = () => {
  const [mutation, mutationResults] = useMutation(authRequestEmailVerificationEmailMutationGQL);

  const execute = (userId: number) => {
    return mutation({
      variables: {
        userId,
      },
    });
  };
  return [execute, mutationResults] as const;
};
