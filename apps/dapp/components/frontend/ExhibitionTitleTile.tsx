import React from "react";
import Link from "next/link";

import { Box, LinkBox, LinkOverlay, chakra, Heading } from "@chakra-ui/react";

export const ExhibitionTitleTile = ({
  exhibition,
  titleTag = "h1",
  link = true,
}: {
  exhibition: any;
  titleTag?: string;
  link?: boolean;
}) => {
  const href = `/e/${exhibition?.slug}/`;

  let assembledCurators: string;

  // Assemble curators
  assembledCurators = exhibition?.curators?.map((c, i) => (
    <span key={`curator-${i}`}>
      {i > 0 && i < exhibition.curators.length - 1 && ", "}
      {i == exhibition.curators.length - 1 && " and "}
      {createCuratorLink(exhibition.curators[i])}
    </span>
  ));

  if (link) {
    return (
      <LinkBox
        as="div"
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <Heading as={titleTag as any} textStyle="worktitle" mt="auto" mb="2rem">
          <Link href={href} passHref>
            <LinkOverlay>{exhibition?.title}</LinkOverlay>
          </Link>
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {exhibition?.subtitlePrefix} {assembledCurators}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(exhibition?.dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(exhibition?.dateEnd).toLocaleDateString("de")}
        </chakra.p>
      </LinkBox>
    );
  } else {
    return (
      <Box
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <Heading as={titleTag as any} textStyle="worktitle" mt="auto" mb="2rem">
          {exhibition?.title}
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {exhibition?.subtitlePrefix} {assembledCurators}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(exhibition?.dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(exhibition?.dateEnd).toLocaleDateString("de")}
        </chakra.p>
      </Box>
    );
  }
};

const createCuratorLink = (curator) => {
  if (!curator?.user?.ethAddress) return <></>;

  let name = curator.user.pseudonym
    ? curator.user.pseudonym
    : curator.user.ethAddress.slice(0, 8) + "…";
  let url = `/u/${curator.user.ethAddress}`;
  // console.log("Curator: ", name, url);
  return <Link href={url}>{name}</Link>;
};
