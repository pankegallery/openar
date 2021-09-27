import { useMutation } from "@apollo/client";
import {
  userProfileUpdateMutationGQL,
  userMaybeClaimCollectorsRoleUpdateMutationGQL,
} from "~/graphql/mutations";

export const useUserProfileUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(
    userProfileUpdateMutationGQL,
    {
      // onCompleted: (data) => {},
    }
  );

  const execute = (id: number, data: any) => {
    return mutation({
      variables: {
        id,
        data,
      },
    });
  };
  return [execute, mutationResults] as const;
};

export const useUserMaybeClaimCollectorsRoleUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(
    userMaybeClaimCollectorsRoleUpdateMutationGQL,
    {
      // onCompleted: (data) => {},
    }
  );

  const execute = (id: number) => {
    return mutation({
      variables: {
        id,
      },
    });
  };
  return [execute, mutationResults] as const;
};
