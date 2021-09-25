import { GraphQLClient, gql } from "graphql-request";

import { bigNumberToEther } from "@openar/crypto";

import { getApiConfig } from "../config";

const apiConfig = getApiConfig();

const getLastFinalizedBid = (inactiveBids: any) => {
  if (inactiveBids && inactiveBids.length > 0) {
    return inactiveBids.reduce((lastFinalized: any, bid: any) => {
      if (bid.type === "Finalized") {
        if (
          !lastFinalized ||
          bid.inactivatedAtTimestamp > lastFinalized.inactivatedAtTimestamp
        )
          return bid;
      }
      return lastFinalized;
    }, null);
  }
  return null;
};

export const daoSubgraphGetOwnedTokenByEthAddress = async (
  ethAddress: string,
  first: number,
  skip: number
) => {
  const query = gql`
    query medias($ethAddress: String!, $first: Int!, $skip: Int!) {
      medias(
        where: { owner: $ethAddress }
        first: $first
        skip: $skip
        orderBy: id
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

  const client = new GraphQLClient(apiConfig.baseUrl.subgraph);

  const tokenInfo = await client.request(query, {
    ethAddress: ethAddress.toLowerCase(),
    first,
    skip,
  });

  if (tokenInfo && tokenInfo.medias && tokenInfo.medias.length > 0)
    return tokenInfo.medias;

  return null;
};

export const daoSubgraphGetArObjectTokens = async (
  arObjectKey: string,
  first: number,
  skip: number
) => {
  const query = gql`
    query medias($arObjectKey: String!, $first: Int!, $skip: Int!) {
      medias(
        where: { arObjectKey: $arObjectKey }
        first: $first
        skip: $skip
        orderBy: id
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

  const client = new GraphQLClient(apiConfig.baseUrl.subgraph);

  const tokenInfo = await client.request(query, {
    arObjectKey,
    first,
    skip,
  });

  if (tokenInfo && tokenInfo.medias && tokenInfo.medias.length > 0)
    return tokenInfo.medias;

  return null;
};

export const daoSubgraphGetParsedTokenInfo = async (ownedTokens: any) => {
  if (!ownedTokens || ownedTokens.length === 0) return null;

  return ownedTokens.reduce((agg: any, token: any) => {
    const lastFinalizedBid = getLastFinalizedBid(token.inactiveBids);
    const tokenInfo = {
      id: token.id,
      artworkKey: token.artworkKey,
      arObjectKey: token.arObjectKey,
      editionNumber: parseInt(token.editionNumber),
      editionOf: parseInt(token.editionOf),
      contentURI: token.contentURI,
      metadataURI: token.metadataURI,
      creator: token.creator.id,
      inactiveBids: token.inactiveBids,
      boughtFor: lastFinalizedBid
        ? parseFloat(bigNumberToEther(lastFinalizedBid?.amount))
        : null,

      owner: token.owner.id,
      currentAsk:
        token.currentAsk && token.currentAsk?.amount
          ? parseFloat(bigNumberToEther(token.currentAsk?.amount))
          : null,
    };

    const tI = [
      ...(token.arObjectKey in agg ? agg[token.arObjectKey] : []),
      tokenInfo,
    ].sort((a, b) => {
      if (a.editionOf < b.editionOf) return -1;
      if (a.editionOf > b.editionOf) return -1;
      return 0;
    });
    return {
      ...agg,
      [token.arObjectKey]: tI,
    };
  }, {});
};

export const daoSubgraphGetParsedTokenInfos = async (arObjTokens: any) => {
  if (!arObjTokens || arObjTokens.length === 0) return null;

  return arObjTokens.map((token: any) => {
    const lastFinalizedBid = getLastFinalizedBid(token.inactiveBids);
    return {
      id: token.id,
      artworkKey: token.artworkKey,
      arObjectKey: token.arObjectKey,
      editionNumber: parseInt(token.editionNumber),
      editionOf: parseInt(token.editionOf),
      contentURI: token.contentURI,
      metadataURI: token.metadataURI,
      creator: token.creator.id,
      inactiveBids: token.inactiveBids,
      boughtFor: lastFinalizedBid
        ? parseFloat(bigNumberToEther(lastFinalizedBid?.amount))
        : null,

      owner: token.owner.id,
      currentAsk:
        token.currentAsk && token.currentAsk?.amount
          ? parseFloat(bigNumberToEther(token.currentAsk?.amount))
          : null,
    };
  }, {});
};
