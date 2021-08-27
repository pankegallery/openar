import gql from "graphql-tag";

export const artworkCreateMutationGQL = gql`
  mutation artworkCreate($data: ArtworkUpsertInput!) {
    artworkCreate(data: $data) {
      id 
      title
      description
      status
    }
  }
`;

export const artworkUpdateMutationGQL = gql`
  mutation artworkUpdate($id: Int!, $data: ArtworkUpsertInput!) {
    artworkUpdate(id: $id, data: $data) {
      id 
      title
      description
      status
    }
  }
`;