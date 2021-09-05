import React from "react";

import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import {ArrowLink} from "~/components/ui";
import {CornerButton, EmbeddedVideoPlayer} from "~/components/frontend";

import LogoXDAI from "~/assets/img/xdai/xdai-white.svg"

export const ArtworkDetails = ({ artwork, object }: {artwork: any, object: any}) => {

  let artist = artwork.creator?.pseudonym ? artwork.creator?.pseudonym : artwork.creator?.ethAddress;

  console.log("[ArtworkDetails] Artwork: ", artwork)
  console.log("[ArtworkDetails] object: ", object)

  /* --------- COL: Artwork details) --------- */

  let videoPlayer;

  if (artwork.video && artwork.video.trim().lenght > 0)
    videoPlayer = <EmbeddedVideoPlayer url={artwork.video} />

  return(

    <Flex
      direction="column"
      className="artworkDetails"
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
    >
      {/* ======== BOX: Artwork title  ======== */}
      <Box
        className="artworkTitle"
        borderBottom="1px solid white"
        p="6"
      >
        <chakra.h1 textStyle="subtitle" maxWidth="80%">{artwork.title}</chakra.h1>
        <chakra.p textStyle="copy">{artist}</chakra.p>
        <chakra.p textStyle="meta">{new Date(artwork.createdAt).getFullYear()}</chakra.p>

      </Box>

      <Box

        width="100%"
        overflow="auto"
        flexGrow="0"
      >

        {/* ======== BOX: Artwork description  ======== */}
        <Box
          className="artworkDescription"
          borderBottom="1px solid white"
          p="6"
        >
          <chakra.p textStyle="label" className="label">Artwork description</chakra.p>
          <div dangerouslySetInnerHTML={{__html: artwork.description}} />
        </Box>

        {/* ======== BOX: Artwork purchase  ======== */}
        {artwork.askPrice&&
          <Box
            className="artworkPurchase"
            borderBottom="1px solid white"
            p="6"
            position="relative"
          >
            <CornerButton label="Buy" position="top" emphasis onClick=""/>
            <chakra.p textStyle="subtitle" mb="10" sx={{svg:{display: "inline-block"}}}>
              <LogoXDAI width="30px" height="20px" viewBox="40 0 150 150"/>{artwork.arObjects[0].askPrice} xDai
            </chakra.p>
            {/* ======== TODO: Edition number  ======== */}
            <chakra.p mb="0 !important" textStyle="label" className="label">Edition <chakra.span fontWeight="300" pl="1rem">3/{object.editionOf}</chakra.span></chakra.p>
          </Box>
        }

            {/* _____________________________

                TODO: Buy Button onclick LINK
            _______________________________*/}

        {/* ======== BOX: Artwork further link  ======== */}
        {artwork.url&&
          <Box
            className="artworkURL"
            borderBottom="1px solid white"
            p="6"
          >
            <chakra.p textStyle="label" className="label">More information</chakra.p>
            <ArrowLink href={artwork.url}>{artwork.url}</ArrowLink>
          </Box>
        }


        {/* ======== BOX: Artist profile  ======== */}
        {artwork.creator.bio&&
          <Box
            className="artistInfo"
            borderBottom="1px solid white"
            p="6"
            position="relative"
          >
            <CornerButton label="View profile" onClick=""/>
            <chakra.p textStyle="label" className="label">About the artist</chakra.p>
            <div dangerouslySetInnerHTML={{__html: artwork.creator.bio}}  />
          </Box>
        }


          {/* _____________________________

                TODO: View Profile onclick LINK
            _______________________________*/}



        {/* ======== BOX: Artwork video  ======== */}
        { videoPlayer &&
          <Box
            className="artworkVideo"
            borderBottom="1px solid white"
            p="6"
            sx={{
              ".chakra-aspect-ratio":{
                mx:"-6",
                mt:"6",
                mb:"-10",
              }
            }}
          >
            <chakra.p textStyle="label" className="label">Artwork video</chakra.p>
            
          </Box>
        }

      </Box>
    </Flex>
  );
};

export default ArtworkDetails;
