import React from "react";
import {
  AspectRatio,
  Box,
  LinkBox,
  LinkOverlay,
  chakra,
  Heading,
} from "@chakra-ui/react";
import { ApiImage } from "../ui";
import { ArtworkStatusEnum } from "~/utils";
import Link from "next/link";

export const ArtworkListItem = ({
  id,
  title,
  key,
  creator,
  heroImage,
  status,
  isWhite = false, 
  isAdmin = false
}: {
  id: number;
  title: string;
  key: string;
  creator: any;
  heroImage: any;
  status: number;
  isWhite?: boolean;
  isAdmin?: boolean;
}) => {
  let artist = creator?.pseudonym ? `${creator?.pseudonym}` : "";
  if (artist.trim().length === 0) artist = creator?.ethAddress;

  const href = (isAdmin)? `/openar/artworks/${id}/update` : `/a/${key}/`;

  return (
    <LinkBox as="article" className={`${isWhite ? "white":""} artwork list item`} key={`artwork-${id}`}>
      <Box className="info">
        <Heading as="h2" className="title">
          <Link href={href} passHref>
            <LinkOverlay>{title}</LinkOverlay>
          </Link>
        </Heading>
        <chakra.span className="artist">{artist}</chakra.span>
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
          />
        </AspectRatio>
      </Box>
    </LinkBox>
  );
};
