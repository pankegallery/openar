import { useMutation } from "@apollo/client";

import { artworkArObjectCreateMutationGQL, artworkArObjectUpdateMutationGQL, artworkArObjectMintMutationGQL } from "~/graphql/mutations";

export const useArObjectCreateMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkArObjectCreateMutationGQL, {
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


export const useArObjectUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkArObjectUpdateMutationGQL, {
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


export const useArObjectMintMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkArObjectMintMutationGQL, {
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