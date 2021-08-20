import gql from "graphql-tag";

export const imageCreateMutationGQL = gql`
  mutation imageCreate($data: TermCreateInput!) {
    imageCreate(data: $data) {
      id
      ownerId
      meta
      thumbUrl
      status
    }
  }
`;

export const imageUpdateMutationGQL = gql`
  mutation imageUpdate($id: Int!, $data: TermUpdateInput!) {
    imageUpdate(id: $id, data: $data) {
      id
      ownerId
      meta
      thumbUrl
      status
    }
  }
`;

export const imageDeleteMutationGQL = gql`
  mutation imageDelete($id: Int!) {
    imageDelete(id: $id) {
      result
    }
  }
`;
