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
import { useRouter } from 'next/router'


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
}: {
  id: number;
  title: string;
  col: Int;
  urlKey: string;
  exSlug?: string;
  creator: any;
  heroImage: any;
  status: number;
  isWhite?: boolean;
  isAdmin?: boolean;
}) => {
  let artist = creator?.pseudonym ? `${creator?.pseudonym}` : "";

  // `
  if (artist.trim().length === 0) artist = creator?.ethAddress;

  const router = useRouter();
  console.log(router)

  let cameFromExhibition;

  if(router.components) cameFromExhibition = "/e/[slug]" in router.components

  // TODO: change a-detail to a once opening exhibition done
  const baseURL = cameFromExhibition ? router.asPath : "/a-detail"
  const href = isAdmin ? `/openar/artworks/${id}/update` : `${baseURL}/${urlKey}/`;

  return (
    <LinkBox
      as="article"
      className={`${isWhite ? "white" : ""} artwork list item col-${col}`}
      key={`artwork-${id}`}
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
