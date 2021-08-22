import gql from "graphql-tag";

export const userReadQueryGQL = gql`
  query userRead($id: Int!) {
    userRead(id: $id) {
      id
      firstName
      lastName
      email
      emailVerified
      role
      userBanned
      createdAt
      updatedAt
    }
  }
`;

export default userReadQueryGQL;
