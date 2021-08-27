import gql from "graphql-tag";

export const arModelDeleteMutationGQL = gql`
  mutation arModelDelete($id: Int!) {
    arModelDelete(id: $id) {
      result
    }
  }
`;
