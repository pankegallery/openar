import gql from "graphql-tag";

export const exhibitionCreateMutationGQL = gql`
  mutation exhibitionCreate($data: ArtworkUpsertInput!) {
    exhibitionCreate(data: $data) {
      id
      title
      description
      status
    }
  }
`;

export const exhibitionUpdateMutationGQL = gql`
  mutation exhibitionUpdate($id: Int!, $data: ArtworkUpsertInput!) {
    exhibitionUpdate(id: $id, data: $data) {
      id
      title
      description
      status
    }
  }
`;

export const exhibitionDeleteMutationGQL = gql`
  mutation exhibitionDelete($id: Int!) {
    exhibitionDelete(id: $id) {
      result
    }
  }
`;

export const exhibitionReorderArtworksMutationGQL = gql`
  mutation exhibitionReorderArtworks($id: Int!, $data: [ArtworkOrderInput]!) {
    exhibitionReorderArtworks(id: $id, data: $data) {
      id
      key
    }
  }
`;


