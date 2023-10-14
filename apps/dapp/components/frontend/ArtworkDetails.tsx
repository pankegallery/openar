import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";

import { Box, Text, Flex, chakra } from "@chakra-ui/react";
import { ArrowLink } from "~/components/ui";
import {
  CornerButton,
  EmbeddedVideoPlayer,
  isValidEmbeddedVideoPlayerVideo,
  WalletActionRequired,
  IncompleteOverlay,
} from "~/components/frontend";

import LogoXDAI from "~/assets/img/xdai/xdai-white.svg";
import { useAuthentication, useWalletLogin, useAppToast } from "~/hooks";
import { arObjectTokensQueryGQL } from "~/graphql/queries";
import { BeatLoader } from "react-spinners";
import LeafletMap from "../modules/map";

import {
  OpenAR,
  Decimal,
  platformCuts,
  bigNumberToEther,
  numberToBigNumber,
} from "@openar/crypto";

import { appConfig } from "~/config";
import { getArtistName } from "~/utils";
import { useUserMaybeClaimCollectorsRoleUpdateMutation } from "~/hooks/mutations";

export const ArtworkDetails = ({
  artwork,
  object,
  onUserLocationUpdate,
}: {
  artwork: any;
  object: any;
  onUserLocationUpdate: any;
}) => {
  const [profileUrl, setProfileUrl] = useState(`/u/${artwork.creator.id}`);
  const [claimCollectorRoleMutation] =
    useUserMaybeClaimCollectorsRoleUpdateMutation();

  const buySuccessToast = useAppToast(
    "Congratulations",
    "You've bought an edtion of this object",
    "success"
  );
  useUserMaybeClaimCollectorsRoleUpdateMutation;
  const buyErrorToast = useAppToast("Oops", "Please login to buy", "error");

  const [appUser, { hasCookies }] = useAuthentication();
  const [cryptoError, setCryptoError] = useState(undefined);
  const [isAwaitingWalletInteraction, setIsAwaitingWalletInteraction] =
    useState(false);
  const [isAwaitingBlockConfirmation, setIsAwaitingBlockConfirmation] =
    useState(false);
  const { library, account, chainId } = useWalletLogin();

  const subgraphQuery = useQuery(arObjectTokensQueryGQL, {
    variables: {
      key: object?.key ?? "",
    },
  });

  const artist = getArtistName(
    artwork.creator?.pseudonym,
    artwork.creator?.ethAddress
  );

  useEffect(() => {
    if (appUser && appUser.id === artwork?.creator?.id) {
      setProfileUrl("/x/");
    }
  }, [appUser, artwork?.creator?.id]);

  const ownedToken =
    subgraphQuery?.data?.arObjectTokens?.totalCount > 0
      ? subgraphQuery?.data?.arObjectTokens?.tokens.filter(
          (token) =>
            token.subgraphinfo.creator === token.subgraphinfo.owner &&
            token.subgraphinfo.creator.toLowerCase() ===
              artwork.creator?.ethAddress.toLowerCase()
        )
      : [];

  const collectors =
    subgraphQuery?.data?.arObjectTokens?.totalCount > 0
      ? subgraphQuery?.data?.arObjectTokens?.tokens.reduce(
          (agg: any, token) => {
            if (token.subgraphinfo.creator !== token.subgraphinfo.owner) {
              if (!(token.subgraphinfo.owner in agg)) {
                agg[token.subgraphinfo.owner] = {
                  tokens: [token],
                  collector: token.collector,
                };
                return agg;
              }
              agg[token.subgraphinfo.owner].tokens = [
                ...agg[token.subgraphinfo.owner].tokens,
                token,
              ];
            }
            return agg;
          },
          {}
        )
      : null;

  const currentAsk =
    ownedToken.length > 0 && ownedToken[0]?.subgraphinfo?.currentAsk
      ? ownedToken[0]?.subgraphinfo.currentAsk
      : null;

  /* --------- COL: Artwork details) --------- */

  const buy = async (tokenId: number, bid: number) => {
    let openAR: OpenAR;
    setCryptoError(undefined);

    try {
      if (library && account)
        openAR = new OpenAR(library.getSigner(account), chainId);

      if (!openAR || !appUser) {
        setCryptoError("Could not initialize connection to wallet");
        return;
      }

      setIsAwaitingWalletInteraction(true);

      const ownerCut = Decimal.rawBigNumber(
        Decimal.new(100)
          .value.sub(platformCuts.furtherSalesPool.value)
          .sub(platformCuts.furtherSalesPlatform.value)
          .sub(platformCuts.furtherSalesCreator.value)
      );

      const tx = await openAR
        .buyFirstAvailableNative(
          ownedToken.map((token) => parseInt(token.subgraphinfo.id)).sort(),
          artwork.creator?.ethAddress.toLowerCase(),
          openAR.createBid(bid, account),
          {
            platform: platformCuts.furtherSalesPlatform,
            pool: platformCuts.furtherSalesPool,
            owner: ownerCut,
            creator: platformCuts.furtherSalesCreator,
            prevOwner: Decimal.new(0),
          }
        )
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          if (err.message.indexOf("denied transaction") > -1) {
            setCryptoError("You've rejected the transaction");
          } else {
            setCryptoError(err.message);
          }
        });

      if (!tx) return;

      setIsAwaitingWalletInteraction(false);
      setIsAwaitingBlockConfirmation(true);

      tx.wait(chainId === 31337 ? 0 : appConfig.numBlockConfirmations)
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          setCryptoError(err.message);
        })
        .finally(() => {
          setTimeout(
            async () => {
              // TODO: make interaction nicer ...
              // Communicate the token number of the just bought token
              // Query subgraph by owner wallet for the tokens of this object.
              // Latest inactive bid should reveal the
              buySuccessToast(
                "Congratulations",
                `You've bought an edition of this object `
              );
              subgraphQuery.refetch();

              if (!appUser.roles.includes("collector")) {
                try {
                  const result = await claimCollectorRoleMutation(appUser.id);
                } catch (err) {}
              }

              setIsAwaitingBlockConfirmation(false);
            },
            chainId === 31337 ? 5000 : 0
          );
        });
    } catch (err) {
      setIsAwaitingBlockConfirmation(false);
      setCryptoError(err.message);
    }
  };

  const canBuy =
    `${artwork?.creator?.ethAddress}`.toLowerCase() !==
      `${appUser?.ethAddress}`.toLowerCase() &&
    appUser &&
    account &&
    hasCookies();

  return (
    <Flex
      direction="column"
      className="artworkDetails"
      w={{
        base: "100vw",
        t: "50vw",
        d: "33.3vw",
      }}
      height={{
        base: "auto",
        t: "100%",
      }}
      minHeight="100vh"
      bg="var(--chakra-colors-openar-muddygreen)"
      overflowY="auto"
    >
      {/* ======== BOX: Artwork title  ======== */}
      <Box className="artworkTitle" borderBottom="1px solid white" p="6">
        <chakra.h1 textStyle="pagetitle" maxWidth="80%">
          {artwork.title}
        </chakra.h1>
        <chakra.p textStyle="copy" h="auto" m="0">
          {artist}
        </chakra.p>
        <chakra.p textStyle="meta">
          {new Date(artwork.createdAt).getFullYear()}
        </chakra.p>
      </Box>

      <Box width="100%" overflow={object?.isGeolocationEnabled ? "hidden" : "auto"} height="100%" position="relative" flexGrow={0}>
        {object?.isGeolocationEnabled && (
          <IncompleteOverlay
            cornerRem="6rem"
            headline="This artwork is site-specific. "
            subline="Go to the location shown on the map in order to experience it in AR."
            href=""
            height="100%"
            marginLeft="6"
            marginTop="10"
            align="top"
          >
            <LeafletMap
              lat={object.lat}
              lng={object.lng}
              shouldUpdateMarkerToMapCenter={false}
              shouldLocateUser={true}
              onUserLocationUpdate={onUserLocationUpdate}
            />
          </IncompleteOverlay>
        )}
        {/* ======== BOX: Artwork description  ======== */}
        <Box
          className="artworkDescription"
          borderBottom="1px solid white"
          p="6"
        >

          <chakra.p textStyle="label" className="label" mt="4">
            Artwork description
          </chakra.p>
          <div dangerouslySetInnerHTML={{ __html: artwork.description }} />

          {object?.description && (
            <>
              <chakra.p textStyle="label" mt="4" className="label">
                Object description
              </chakra.p>
              <div dangerouslySetInnerHTML={{ __html: object.description }} />
            </>
          )}
        </Box>

        {/* ======== BOX: Artwork purchase  ======== */}
        {currentAsk && ownedToken.length > 0 && (
          <Box
            className="artworkPurchase"
            borderBottom="1px solid white"
            p="6"
            position="relative"
          >
            <CornerButton
              label="Buy"
              position="top"
              emphasis
              hasTooltip={true}
              tooltipText="Buying artworks is a legacy feature"
              onClick={() => {
                if (canBuy) {
                  buy(ownedToken[0].id, parseFloat(currentAsk ?? "0"));
                } else {
                  if (
                    `${artwork?.creator?.ethAddress}`.toLowerCase() ===
                    `${appUser?.ethAddress}`.toLowerCase()
                  ) {
                    buyErrorToast("Oops", "You can't purchase your own token.");
                  } else if (appUser && appUser.email) {
                    buyErrorToast(
                      "Oops",
                      "Please connect your xDai wallet to your account in order to purchase this work."
                    );
                  } else {
                    buyErrorToast(
                      "Oops",
                      "Please login to purchase this artwork."
                    );
                  }
                }
              }}
              isDisabled={!canBuy}
            />
            <chakra.p
              textStyle="subtitle"
              mb="10"
              sx={{ svg: { display: "inline-block" } }}
            >
              <LogoXDAI width="30px" height="20px" viewBox="40 0 150 150" />
              {currentAsk} xDai
            </chakra.p>
            {/* ======== TODO: Edition number  ======== */}
            <chakra.p mb="0 !important" textStyle="label" className="label">
              Edition of {ownedToken[0].subgraphinfo.editionOf}
            </chakra.p>
            <chakra.p>
              {ownedToken.length} available. Next for sale is edition number{" "}
              {ownedToken[0].subgraphinfo.editionNumber}.
            </chakra.p>
            {(subgraphQuery.loading || isAwaitingBlockConfirmation) && (
              <IncompleteOverlay
                cornerRem="8rem"
                headline={
                  isAwaitingBlockConfirmation
                    ? "Awaiting transaction confirmation"
                    : "Loading data"
                }
                height="100%"
                marginLeft="6"
                marginBottom="0"
                justifyContent="center"
                alignItems="center"
                subline={
                  <Flex w="100%" justifyContent="center" pt="2">
                    <BeatLoader color="#fff" />
                  </Flex>
                }
              />
            )}
          </Box>
        )}

        {/* ======== BOX: Artwork further link  ======== */}
        {artwork.url && (
          <Box className="artworkURL" borderBottom="1px solid white" p="6">
            <chakra.p textStyle="label" className="label">
              More information
            </chakra.p>
            <ArrowLink href={artwork.url}>{artwork.url}</ArrowLink>
          </Box>
        )}

        {/* ======== BOX: Artist profile  ======== */}
        {profileUrl && (
          <Box
            className="artistInfo"
            borderBottom="1px solid white"
            p="6"
            position="relative"
          >
            <CornerButton href={profileUrl} label="View profile" />

            <chakra.p textStyle="label" className="label">
              About the artist
            </chakra.p>
            <div dangerouslySetInnerHTML={{ __html: artwork.creator.bio }} />
          </Box>
        )}

        {/* ======== BOX: Artwork video  ======== */}
        {artwork.video &&
          artwork.video.trim().length > 0 &&
          isValidEmbeddedVideoPlayerVideo(artwork.video) && (
            <Box className="artworkVideo" borderBottom="1px solid white">
              <Box
                p="6"
                textStyle="label"
                className="label"
                mb="0px !important"
              >
                Artwork video
              </Box>
              <EmbeddedVideoPlayer url={artwork.video} />
            </Box>
          )}

        {collectors && Object.keys(collectors).length > 0 && (
          <Box className="artworkURL" borderBottom="1px solid white" p="6">
            <chakra.p textStyle="label" className="label">
              Collectors
            </chakra.p>
            {Object.keys(collectors).map((ckey) => {
              const collector = collectors[ckey];

              return (
                <Box key={`c-${collector.collector.ethAddress}`}>
                  <ArrowLink href={`/u/${collector.collector.id}`}>
                    {getArtistName(
                      collector.collector.pseudonym,
                      collector.collector.ethAddress
                    )}
                  </ArrowLink>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <WalletActionRequired
        isOpen={isAwaitingWalletInteraction}
        showClose={!!cryptoError}
        onClose={() => {
          setIsAwaitingWalletInteraction(false);
          setCryptoError(false);
        }}
        title="Confirmation required"
        error={cryptoError}
      >
        <Text color="white" mb="4">
          Please confirm the transaction in your wallet.
        </Text>
      </WalletActionRequired>
    </Flex>
  );
};

export default ArtworkDetails;
