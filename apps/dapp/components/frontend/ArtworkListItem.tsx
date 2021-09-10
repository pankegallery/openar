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
  col: number;
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

  // TODO: VVU router.components does not work, does it? TypeScript complains that the function is not known
  // SO I changed the line to simply check if the pathname starts with /e/ should do the same thing
  //if(router.components) cameFromExhibition = "/e/[slug]" in router.components, right? 
  cameFromExhibition = router.pathname.indexOf("/e/") > -1;

  

  // TODO: change a-detail to a once opening exhibition done
  const baseURL = cameFromExhibition ? router.asPath : "/a-detail"

  // CHANGED: There is an edit button now when logged in.
  //  const href = isAdmin ? `/x/a/${id}/update` : `${baseURL}/${urlKey}/`;
  const href = `${baseURL}/${urlKey}/`;

  return (
    <LinkBox
      as="article"
      className={`${isWhite ? "white" : ""} artwork list item col-${col}`}
      key={`artwork-${id}`}
      borderBottom="1px solid white"
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
      {isAdmin &&
        <Link href={`/x/a/${id}/update`} passhref>
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
