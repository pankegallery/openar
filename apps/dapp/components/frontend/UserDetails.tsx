import React from "react";

import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import {ArrowLink} from "~/components/ui";
import {CornerButton, RoleBadgeControl} from "~/components/frontend";

export const UserDetails = ({ user }: {user: any}) => {

  let name = user?.pseudonym ? user?.pseudonym : user?.ethAddress;

  console.log("[UserDetails] user: ", user)
  console.log("[UserDetails] name: ", name)

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

  /* --------- COL: User details) --------- */

  return(

    <Flex
      direction="column"
      layerStyle="backdropMud"
      className="artworkDetails"
      color="white"
      w={{
        base: "100vw",
        t: "50vw",
        d: "33.3vw"
      }}
      height={{
          base: "auto",
          t: "100%"
        }}
      minHeight="100vh"
      bg="var(--chakra-colors-openar-muddygreen)"
      overflowY="auto"
      borderLeft="1px solid white"
    >
      {/* ======== BOX: Profile title  ======== */}
      <Box
        className="artworkTitle"
        borderBottom="1px solid white"
        p="6"
        pt="20"
      >
        <chakra.p textStyle="label" className="label">Profile</chakra.p>
        <chakra.h1 textStyle="subtitle" maxWidth="80%">{name}</chakra.h1>

      </Box>

      <Box

        width="100%"
        overflow="auto"
        flexGrow={0}
      >

        {/* ======== BOX: User bio  ======== */}
        <Box
          className="artworkDescription"
          borderBottom="1px solid white"
          p="6"
        >
          <chakra.p textStyle="label" className="label">About</chakra.p>
          <div dangerouslySetInnerHTML={{__html: user.bio}} />
        </Box>


        {/* ======== BOX: User badges  ======== */}
        {user.roles?.length > 0 &&
          <Box
            className="artworkURL"
            position="relative"
            borderBottom="1px solid white"
            p="6"
          >
            <CornerButton label="View badges" href="/p/badges"/>
            <chakra.p textStyle="label" className="label">Roles</chakra.p>

            {user.roles.map(role => {
              return <RoleBadgeControl role={allRoles.filter(r => r.slug === role)[0]} />
            })}
          </Box>
        }

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
            {user.reviews.map(review => (
              <ArrowLink href={review.url}>{review.title}</ArrowLink>
            ))}

          </Box>
        }

      </Box>
    </Flex>
  );
};
export default UserDetails;
