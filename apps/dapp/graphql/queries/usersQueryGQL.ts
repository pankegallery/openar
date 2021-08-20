import gql from "graphql-tag";

export const usersQueryGQL = gql`
  query users($where: JSON, $orderBy: JSON, $pageIndex: Int, $pageSize: Int) {
    users(
      where: $where
      orderBy: $orderBy
      pageIndex: $pageIndex
      pageSize: $pageSize
    ) {
      users {
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
      totalCount
    }
  }
`;

export default usersQueryGQL;
