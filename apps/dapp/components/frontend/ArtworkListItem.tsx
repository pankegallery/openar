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
  urlKey,
  exSlug,
  creator,
  heroImage,
  status,
  isWhite = false,
  isAdmin = false,
}: {
  id: number;
  title: string;
  urlKey: string;
  exSlug?: string;
  creator: any;
  heroImage: any;
  status: number;
  isWhite?: boolean;
  isAdmin?: boolean;
}) => {
  let artist = creator?.pseudonym ? `${creator?.pseudonym}` : "";
  if (artist.trim().length === 0) artist = creator?.ethAddress;

  const href = isAdmin ? `/openar/artworks/${id}/update` : `/e/openar-art/${urlKey}/`;

  return (
    <LinkBox
      as="article"
      className={`${isWhite ? "white" : ""} artwork list item`}
      key={`artwork-${id}`}
    >
      <Box className="info" p="4">
        <chakra.h2
          className="title"
          fontWeight="600"
        >
          <LinkOverlay href={href} passHref>{title}</LinkOverlay>
        </chakra.h2>
        <chakra.span
          width="2em"
          overflow="hidden"
          display="block"
          text-overflow="ellipsis"
          white-space="nowrap"
          className="artist"
          textStyle="meta">{artist}</chakra.span>
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
    </LinkBox>
  );
};
