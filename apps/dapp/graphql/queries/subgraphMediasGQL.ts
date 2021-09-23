import gql from "graphql-tag";

export const getArObjectTokenInfoGQL = gql`
  query medias($arObjectKey: String!) {
    medias(
      where: { arObjectKey: $arObjectKey }
      first: 100
      orderBy: editionNumber
      orderDirection: asc
    ) {
      currentAsk {
        amount
      }
      id
      transactionHash
      contentURI
      metadataURI
      contentHash
      metadataHash
      editionNumber
      editionOf
      creator {
        id
      }
      owner {
        id
      }
    }
  }
`;
