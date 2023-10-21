import React from "react";
import {
  AspectRatio,
  Box,
  LinkBox,
  LinkOverlay,
  chakra,
  Heading,
  Button
} from "@chakra-ui/react";
import { ApiImage } from "../ui";
import { ArtworkStatusEnum, getArtistName } from "~/utils";
import Link from "next/link";
import Router, {useRouter} from 'next/router'

export const ArtworkListItem = ({
  id,
  title,
  urlKey,
  col,
  creator,
  heroImage,
  status,
  isWhite = false,
  isAdmin = false,
  isPublic = true,
  isCollectedObject = false,
  subgraphInfo
}: {
  id: number;
  title: string;
  col: number | string;
  urlKey: string;
  exSlug?: string;
  creator: any;
  heroImage: any;
  status: number;
  isWhite?: boolean;
  isAdmin?: boolean;
  isPublic?: boolean;
  isCollectedObject?: boolean;
  subgraphInfo?: any[];
}) => {
  const router = useRouter();

  let artist = getArtistName(creator?.pseudonym, creator?.ethAddress);

  const baseURL = router.pathname.indexOf("/e/") > -1 ? router.asPath : "/a"

  const href = `${baseURL}/${urlKey}/`;

  let editionInfos, purchasePrices;

  if (isCollectedObject && subgraphInfo && subgraphInfo.length > 0) {
    const eNumbers = subgraphInfo.map((token) =>  token.editionNumber)
    if (eNumbers)
      editionInfos =  <Box fontSize="sm">
      Edition # {eNumbers.join(", ")} of {subgraphInfo[0].editionOf}
      </Box> 

    if (!isPublic) {
      const pPrices = subgraphInfo.map((token) =>  token.boughtFor)
      if (pPrices)
      purchasePrices =  <Box fontSize="sm">
        Bought for {pPrices.join(", ")} xDai
        </Box> 
    }
  } 

  if (!isAdmin && !heroImage?.id)
    return <></>

  return (
    <LinkBox
      as="article"
      className={`${isWhite ? "white" : ""} artwork list item col-${col}`}
      key={`artwork-${id}`}
      borderBottom="1px solid white"
      _before={{
        content: `"View artwork"`,
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#bab79fee",
          color: "white",
          zIndex: "100",
          textTransform: "uppercase",
          fontWeight: "800",
          pointerEvents: "none",
          opacity: "0",
          transition: "opacity ease 0.3s, transform ease 2s",
          transform: "scale(98%)",
      }}
      _hover={{
        _before: {
          opacity: "100",
          transform: "scale(102%)",
        }
      }}
    >
      <Box className="info" p="4">
        <chakra.h2
          className="title"
          fontWeight="600"
        >
          <Link  href={href} passHref><LinkOverlay>{title}</LinkOverlay></Link>
        </chakra.h2>
        <chakra.span
          width="2em"
          overflow="hidden"
          display="block"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          className="artist"
          textStyle="meta">{artist}</chakra.span>
        {editionInfos}
        {purchasePrices}
      </Box>
      <Box
        className={`${
          status !== ArtworkStatusEnum.PUBLISHED ? "draft" : "published"
        } img`}
      >
        <AspectRatio ratio={1}>
          <ApiImage
            id={heroImage?.id}
            meta={heroImage?.meta}
            status={heroImage?.status}
            alt={title}
            sizes="(min-width: 45rem) 33vw, 66vw"
            showPlaceholder={isAdmin}
            placeholder={isAdmin ? "Please upload an image" : ""}
          />
        </AspectRatio>
      </Box>
      {isAdmin &&
        <Link href={`/x/a/${id}/update`} passHref>
        <Button
          className="editArtworkButton"
          mx="10"
          my="4"
          px="6"
          alignSelf="end"
        >Edit artwork</Button></Link>
      }
    </LinkBox>
  );
};
