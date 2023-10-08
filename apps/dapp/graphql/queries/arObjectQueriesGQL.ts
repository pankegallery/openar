import gql from "graphql-tag";

export const arObjectTokensQueryGQL = gql`
  query arObjectTokens(
    $key: String!
  ) {
    arObjectTokens(
      key: $key
    ) {
      tokens {
        id
        subgraphinfo
        collector {
          ethAddress
          pseudonym
          id
        }
      }
      totalCount
    }
  }
`;

export default arObjectTokensQueryGQL;
