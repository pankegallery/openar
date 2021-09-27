import { useMutation } from "@apollo/client";

import {
  artworkCreateMutationGQL,
  artworkUpdateMutationGQL,
  artworkDeleteMutationGQL,
  artworkReorderArObjectsMutationGQL,
} from "~/graphql/mutations";

export const useArtworkCreateMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkCreateMutationGQL, {
    // onCompleted: (data) => {},
  });

  const execute = (data: any) => {
    return mutation({
      variables: {
        data,
      },
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
      },
    });
  };
  return [execute, mutationResults] as const;
};

export const useArtworkDeleteMutation = () => {
  const [mutation, mutationResults] = useMutation(artworkDeleteMutationGQL, {
    // onCompleted: (data) => {},
  });

  const execute = (id: number) => {
    return mutation({
      variables: {
        id,
      },
    });
  };
  return [execute, mutationResults] as const;
};

export const useArtworkReorderArObjectsMutation = () => {
  const [mutation, mutationResults] = useMutation(
    artworkReorderArObjectsMutationGQL,
    {
      // onCompleted: (data) => {},
    }
  );

  const execute = (id: number, data: any[]) => {
    return mutation({
      variables: {
        id,
        data
      },
    });
  };
  return [execute, mutationResults] as const;
};
