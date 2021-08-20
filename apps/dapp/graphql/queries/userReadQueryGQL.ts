import gql from "graphql-tag";

export const userReadQueryGQL = gql`
  query userRead($scope: String!, $id: Int!) {
    userRead(scope: $scope, id: $id) {
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
