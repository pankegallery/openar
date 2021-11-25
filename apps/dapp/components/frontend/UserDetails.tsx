import React from "react";
import Link from "next/link";

import { Box, Grid, Flex, chakra, Button } from "@chakra-ui/react";
import { ArrowLink } from "~/components/ui";
import {
  CornerButton,
  RoleBadgeControl,
  ArtworkList,
} from "~/components/frontend";

import { useAuthentication } from "~/hooks";
import { AlertEmailVerification } from "../utils";
import { getArtistName } from "~/utils";

export const UserDetails = ({
  user,
  showArtworks,
  isPublic = true,
}: {
  user: any;
  showArtworks: boolean;
  isPublic: boolean;
}) => {
  let name = getArtistName(user?.pseudonym, user?.ethAddress);
  const isIncomplete = !isPublic && !user?.acceptedTerms;

  const [appUser] = useAuthentication();

  const allRoles = [
    {
      slug: "user",
      title: "User",
      description:
        "Signin to openAR is provided by crypto wallets. You can browse the platform incognito or create your own openAR alter ego. Once you start building your profile, you will earn the user badge.",
      badges: [
        {
          year: 2021,
          image: "badges2021/user@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        },
      ],
    },
    {
      slug: "artist",
      title: "Artist",
      description:
        "The curator badge will be given to all users, that have published an artwork on openAR.",
      badges: [
        {
          year: 2021,
          image: "badges2021/artist@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        },
      ],
    },
    {
      slug: "curator",
      title: "Curator",
      description:
        "The curator badge will be assigned to users, that have successfully curated an exhibition on openAR.",
      badges: [
        {
          year: 2021,
          image: "badges2021/curator@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        },
      ],
    },
    {
      slug: "collector",
      title: "Collector",
      description:
        "The collector badge will be assigned to users, that have bought an AR object on our platform.",
      badges: [
        {
          year: 2021,
          image: "badges2021/collector@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        },
      ],
    },
  ];

  const wT = !isPublic ? "100%" : "50vw";
  /* --------- COL: User details) --------- */

  let badges: any[];

  if (user.roles && user.roles.length > 0) {
    badges = allRoles.reduce((badges, badge) => {
      if (user.roles.includes(badge.slug))
        badges.push(<RoleBadgeControl key={badge.slug} role={badge} />);
      return badges;
    }, []);
  }

  return (
    <Flex
      direction="column"
      layerStyle="backdropMud"
      className="userDetails"
      color="white"
      w={{
        base: "100vw",
        t: `${wT}`,
        d: "33.3vw",
      }}
      height={{
        base: "auto",
        t: "100%",
      }}
      bg="var(--chakra-colors-openar-muddygreen)"
      overflowY="auto"
      borderLeft="1px solid white"
      flex="auto 1 0"
      position="relative"
    >
      {/* ======== BOX: Profile title  ======== */}
      {!isPublic && <AlertEmailVerification />}
      <Box
        className="artworkTitle"
        position="relative"
        borderBottom="1px solid white"
        p="6"
        pt="20"
        minHeight={isIncomplete ? "400px" : "unset"}
      >
        
        {!isPublic && !isIncomplete && (
          <Link href="/x/profile/update" passHref>
            <Button
              position="absolute"
              top="6"
              left={{
                base: "6",
                t: "unset"
              }}
              right={{
                base: "unset",
                t: "6"
              }}
              >
              Edit profile
            </Button>
          </Link>
        )}
        <chakra.p textStyle="label" className="label">
          Profile
        </chakra.p>
        <chakra.h1 textStyle="pagetitle" maxWidth="80%">
          {name}
        </chakra.h1>

        <chakra.h2 fontSize="xs" maxWidth="80%">
          {user?.ethAddress}
        </chakra.h2>
      </Box>

      {/* ======== OVERLAY: Incomplete profile  ======== */}
      {isIncomplete && (
        <Flex
          layerStyle="backdropBlurred"
          w="100%"
          h="400px"
          position="absolute"
          clipPath="polygon(10rem 0%, 100% 0, 100% 100%, 0 100%, 0 10rem)"
          z-index="10"
          display="flex"
          direction="column"
          _before={{
            bg: "#00000020",
          }}
          _after={{
            content: "''",
            bg: "white",
            clipPath:
              "polygon(10rem 0, calc(10rem + 2px) 0%, 0 calc(10rem + 2px), 0 10rem)",
            zIndex: "100",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <Box mx="20" mb="10" mt="auto">
            <chakra.p textStyle="subtitle">
              Looks like you haven’t completed your profile yet.
            </chakra.p>
            <chakra.p pb="6">
              Add some details about yourself to receive your first badge.
            </chakra.p>
            <Link href="/x/profile/update" passHref>
              <Button>Complete Profile</Button>
            </Link>
          </Box>
        </Flex>
      )}

      {/* ======== BOX: Scrollable content  ======== */}

      <Box width="100%" overflow="auto" flexGrow={0}>
        {/* ======== BOX: User bio  ======== */}

        {(user.bio || user.url) && (
          <Box className="bio" borderBottom="1px solid white" p="6">
            {user.bio && (
              <>
                <chakra.p textStyle="label" className="label">
                  About
                </chakra.p>
                <div dangerouslySetInnerHTML={{ __html: user.bio }} />
              </>
            )}

            {/* ======== BOX: User link  ======== */}

            {user.url && (
              <>
                <chakra.p textStyle="label" className="label" mt="6">
                  More information
                </chakra.p>
                <ArrowLink href="user.url">{user.url}</ArrowLink>
              </>
            )}
          </Box>
        )}

        {/* ======== BOX: User badges  ======== */}
        {((badges && badges.length > 0) ||
          (appUser && appUser.ethAddress === user.ethAddress)) && (
          <Box
            className="badges"
            position="relative"
            borderBottom="1px solid white"
            p="6"
          >
            <CornerButton label="View badges" href="/p/badges" />
            <chakra.p textStyle="label" className="label">
              Roles
            </chakra.p>

            {badges && badges.length > 0 && <>{badges}</>}
            {appUser &&
              appUser.ethAddress === user.ethAddress &&
              (!badges || badges.length === 0) && (
                <chakra.p py="6">
                  You haven’t earned any badges yet, begin by adding some
                  details about yourself and confirming your email address,
                  starting to collect, or adding your own artworks to collect
                  further badges.
                </chakra.p>
              )}
          </Box>
        )}

        {/* ======== BOX: User reviews  ======== */}
        {user.reviews && (
          <Box className="reviews" borderBottom="1px solid white" p="6">
            <chakra.p textStyle="label" className="label">
              More information
            </chakra.p>
            {user.reviews.map((review, key) => (
              <ArrowLink href={review.url} key={key}>
                {review.title}
              </ArrowLink>
            ))}
          </Box>
        )}

        {/* ======== BOX: User artworks  ======== */}

        {showArtworks && (
          <ArtworkList artworks={user.artworks} col={1} isPublic={isPublic} isIncomplete={isIncomplete || !user?.emailVerified} />
        )}
      </Box>
    </Flex>
  );
};
export default UserDetails;
