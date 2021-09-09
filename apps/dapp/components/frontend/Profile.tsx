import React from "react";
import { Flex } from "@chakra-ui/react";

import {
  CollectionList,
  ArtworkList,
  UserDetails,
} from "~/components/frontend";

export const Profile = ({ user }: { user: any }) => {
  
  console.log("[Profile] User", user);

  return (
    <>
      <Flex
        flexWrap="wrap"
        position={{
          base: "relative",
          t: "fixed",
        }}
        className="user"
        top="0"
        left="0"
        w="100%"
        p=""
        h={{
          base: "auto",
          t: "100vh",
        }}
        zIndex="200"
        color="white"
        overflow={{
          base: "show",
          t: "hidden",
        }}
      >
        {/* --------- COL: Collection --------- */}
        <CollectionList artworks={user.artworks} />

        {/* --------- COL: Artworks --------- */}
        <ArtworkList artworks={user.artworks} />

        {/* --------- COL: Artwork details) --------- */}
        <UserDetails user={user} />
      </Flex>
    </>
  );
};
