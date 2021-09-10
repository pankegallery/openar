import React from "react";
import Link from "next/link";

import { Box, Grid, Flex, chakra, Button } from "@chakra-ui/react";
import {ArrowLink} from "~/components/ui";
import {CornerButton, RoleBadgeControl, ArtworkList} from "~/components/frontend";

import { useSSRSaveMediaQuery } from "~/hooks";


export const UserDetails = ({ user, showArtworks, isPublic = true }: {user: any; showArtworks: boolean; isPublic: boolean;}) => {

  let name = user?.pseudonym ? user?.pseudonym : user?.ethAddress;
  const isIncomplete = user?.pseudonym || isPublic ? false : true;
//  const isIncomplete = true

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery("(min-width: 45rem) and (max-width: 75rem)");

//  console.log("[UserDetails] user: ", user)
//  console.log("[UserDetails] name: ", name)

  const allRoles=[
    {
      slug: "user",
      title: "User",
      description: "Signin to OpenAR is provided by crypto wallets. You can browse the platform incognito or create your own OpenAR alter ego. Once you start building your profile, you will earn the user badge.",
      badges: [
        {
          year: 2021,
          image: "badges2021/user@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        }
      ],
    },
    {
      slug: "curator",
      title: "Curator",
      description: "The curator badge will be assigned to users, that have successfully curated an exhibition on OpenAR.",
      badges: [
        {
          year: 2021,
          image: "badges2021/curator@6x-100.jpg",
          artist: "Anna-Luise Lorenz",
        }
      ],
    },
  ]

  const wT = !isPublic ? "100%" : "50vw";
  /* --------- COL: User details) --------- */

  return(

    <Flex
      direction="column"
      layerStyle="backdropMud"
      className="userDetails"
      color="white"
      w={{
        base: "100vw",
        t: `${wT}`,
        d: "33.3vw"
      }}
      height={{
          base: "auto",
          t: "100%"
        }}
      bg="var(--chakra-colors-openar-muddygreen)"
      overflowY="auto"
      borderLeft="1px solid white"
      flex="auto 1 0"
      position="relative"
    >
      {/* ======== BOX: Profile title  ======== */}
      <Box
        className="artworkTitle"
        position="relative"
        borderBottom="1px solid white"
        p="6"
        pt="20"
        minHeight={isIncomplete? "400px" : "unset"}
      >
        {!isPublic && !isIncomplete &&
          <Button
            position="absolute"
            top="6"
            right="6"
            href="/x/profile/update"
          >Edit profile</Button>
        }
        <chakra.p textStyle="label" className="label">Profile</chakra.p>
        <chakra.h1 textStyle="pagetitle" maxWidth="80%">{name}</chakra.h1>

        <chakra.h2 fontSize="xs" maxWidth="80%">{user?.ethAddress}</chakra.h2>
      </Box>

      {/* ======== OVERLAY: Incomplete profile  ======== */}
      {isIncomplete &&  (
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
            display: "block"
          }}
        >

          <Box mx="20" mb="10" mt="auto">
            <chakra.p textStyle="subtitle">
              Looks like you haven’t completed your profile yet.
            </chakra.p>
            <chakra.p pb="6">
              Add some details about yourself to receive your first badge.
            </chakra.p>
            <Link href="/x/profile/update" passHref><Button>Complete Profile</Button></Link>
          </Box>
        </Flex>
      )}

      {/* ======== BOX: Scrollable content  ======== */}

      <Box
        width="100%"
        overflow="auto"
        flexGrow={0}
      >

        {/* ======== BOX: User bio  ======== */}

        {user.bio || user.url && (
          <Box
            className="artworkDescription"
            borderBottom="1px solid white"
            p="6"
          >

            {user.bio && (
              <>
                <chakra.p textStyle="label" className="label">About</chakra.p>
                <div dangerouslySetInnerHTML={{__html: user.bio}} />
              </>
            )}

            {/* ======== BOX: User link  ======== */}

            {user.url && (
              <>
                <chakra.p textStyle="label" className="label" mt="6">More information</chakra.p>
              <ArrowLink href="user.url">{user.url}</ArrowLink>
              </>
            )}

          </Box>

        )}

        {/* ======== BOX: User badges  ======== */}
        <Box
          className="artworkURL"
          position="relative"
          borderBottom="1px solid white"
          p="6"
        >
          <CornerButton label="View badges" href="/p/badges"/>
          <chakra.p textStyle="label" className="label">Roles</chakra.p>

          {user.roles?.length > 0 &&
            user.roles.map((role, key) => {
              return <RoleBadgeControl key={key} role={allRoles.filter(r => r.slug === role)[0]} />
            })
          }
          {user.roles?.length == 0 &&
            <chakra.p py="6">You haven’t earned any badges yet, begin by adding some details about
yourself. Start collecting, add your own artworks or write reviews to
              collect further badges.</chakra.p>
          }

        </Box>

            {/* _____________________________

                TODO: Buy Button onclick LINK
            _______________________________*/}

        {/* ======== BOX: User reviews  ======== */}
        {user.reviews&&
          <Box
            className="artworkURL"
            borderBottom="1px solid white"
            p="6"
          >
            <chakra.p textStyle="label" className="label">More information</chakra.p>
            {user.reviews.map((review, key) => (
              <ArrowLink href={review.url} key={key}>{review.title}</ArrowLink>
            ))}

          </Box>
        }

        {/* ======== BOX: User artworks  ======== */}

        {showArtworks &&
          <ArtworkList artworks={user.artworks} col={1} isPublic={isPublic} />
        }

      </Box>
    </Flex>
  );
};
export default UserDetails;
