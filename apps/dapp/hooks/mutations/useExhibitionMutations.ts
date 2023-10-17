import { useMutation } from "@apollo/client";

import {
  exhibitionCreateMutationGQL,
  exhibitionUpdateMutationGQL,
  exhibitionDeleteMutationGQL,
  exhibitionReorderArtworksMutationGQL,
} from "~/graphql/mutations";

export const useExhibitionCreateMutation = () => {
  const [mutation, mutationResults] = useMutation(exhibitionCreateMutationGQL, {
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

export const useExhibitionUpdateMutation = () => {
  const [mutation, mutationResults] = useMutation(exhibitionUpdateMutationGQL, {
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

export const useExhibitionDeleteMutation = () => {
  const [mutation, mutationResults] = useMutation(exhibitionDeleteMutationGQL, {
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

export const useExhibitionReorderArtworksMutation = () => {
  const [mutation, mutationResults] = useMutation(
    exhibitionReorderArtworksMutationGQL,
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
