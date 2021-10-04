import gql from "graphql-tag";

export const getArObjectTokenInfoGQL = gql`
  query medias($arObjectKey: String!, $first: Int!) {
    medias(
      where: { arObjectKey: $arObjectKey }
      first: $first
      orderBy: editionNumber
      orderDirection: asc
    ) {
      currentAsk {
        amount
      }
      id
      arObjectKey
      artworkKey
      contentURI
      metadataURI
      contentHash
      metadataHash
      editionNumber
      transactionHash
      editionOf
      creator {
        id
      }
      owner {
        id
      }
      inactiveBids {
        id
        amount
        type
        inactivatedAtTimestamp
        inactivatedAtBlockNumber
      }
    }
  }
`;
