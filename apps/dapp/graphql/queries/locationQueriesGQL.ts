import gql from "graphql-tag";

export const locationsQueryGQL = gql`
  query locations(
    $where: JSON
    $orderBy: JSON
    $pageIndex: Int
    $pageSize: Int
  ) {
    locations(
      where: $where
      orderBy: $orderBy
      pageIndex: $pageIndex
      pageSize: $pageSize
    ) {
      locations {
        id
        ownerId
        title
        slug
        status
        description
      }
      totalCount
    }
  }
`;

export default locationsQueryGQL;
