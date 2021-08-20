import gql from "graphql-tag";

export const imageStatusGQL = gql`
  query imageStatus($id: Int!) {
    imageStatus(id: $id) {
      id
      status
      meta
    }
  }
`;

export default imageStatusGQL;
