import { userProfileUpdateMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";

export const useUserProfileUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(userProfileUpdateMutationGQL, {
    // onCompleted: (data) => {},
  });

  const execute = (id: number, data: any) => {
    return mutation({
      variables: {
        id, 
        data,
      }
    });
  };
  return [execute, mutationResults] as const;
};
