import { useMutation } from "@apollo/client";

import { artworkCreateMutationGQL, artworkUpdateMutationGQL } from "~/graphql/mutations";

export const useArtworkCreateMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkCreateMutationGQL, {
    // onCompleted: (data) => {},
  });

  const execute = (data: any) => {
    return mutation({
      variables: {
        data,
      }
    });
  };
  return [execute, mutationResults] as const;
};

export const useArtworkUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkUpdateMutationGQL, {
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

