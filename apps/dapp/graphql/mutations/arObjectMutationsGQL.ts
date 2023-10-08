import gql from "graphql-tag";

export const artworkArObjectCreateMutationGQL = gql`
mutation arObjectCreate($data: ArObjectUpsertInput!) {
  arObjectCreate(data: $data) {
    id 
    title
    description
    status
  }
}
`;

export const artworkArObjectUpdateMutationGQL = gql`
mutation arObjectUpdate($id: Int!, $data: ArObjectUpsertInput!) {
  arObjectUpdate(id: $id, data: $data) {
    id 
    title
    description
    status
    isGeolocationEnabled
    lat
    lng
  }
}
`;

export const artworkArObjectMintMutationGQL = gql`
mutation arObjectMint($id: Int!, $data: ArObjectMintInput!) {
  arObjectMint(id: $id, data: $data) {
    id 
    status
  }
}
`;

export const artworkArObjectDeleteMutationGQL = gql`
  mutation arObjectDelete($id: Int!) {
    arObjectDelete(id: $id) {
      result       
    }
  }
`;