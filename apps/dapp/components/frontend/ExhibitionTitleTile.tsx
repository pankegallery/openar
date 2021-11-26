import React from "react";
import Link from "next/link";

import {
  Box,
  LinkBox,
  LinkOverlay,
  chakra,
  Heading,
} from "@chakra-ui/react";

export const ExhibitionTitleTile = ({
  exhibition,
  titleTag="h1",
  link=true,
}: {
  exhibition: any;
  titleTag?: string;
  link?:boolean;
}) => {

  const href = `/e/${exhibition?.slug}/`;
  console.log("[Ex Title Tile] exhibition: ", exhibition)

  let assembledSubtitle, assembledType, assembledCurators;

  // Assemble type with article
  if (exhibition?.type){
    var vowelRegex = '^[aieouAIEOU].*'
    var matched = exhibition?.type.match(vowelRegex)
    assembledType = matched ? "An " : "A "
    assembledType += exhibition?.type
  }

  // Assemble curators
  assembledCurators = exhibition?.curators?.map((c, i) =>
    <>
      {(i>0 && i<exhibition.curators.length - 1 ) && ", "}
      {(i == exhibition.curators.length - 1) && " and "}
      {createCuratorLink(exhibition.curators[i])}
    </>
  )

  // Assemble subtitle
  assembledSubtitle = (
    <>{assembledType} by &nbsp;
      {assembledCurators}
    </>
  )


  if (link){
    return (
      <LinkBox
        as="div"
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <Heading as={(titleTag as any)} textStyle="worktitle" mt="auto" mb="2rem">
          <Link href={href} passHref><LinkOverlay>{exhibition?.title}</LinkOverlay></Link>
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {assembledSubtitle}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(exhibition?.dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(exhibition?.dateEnd).toLocaleDateString("de")}
        </chakra.p>
      </LinkBox>
    );
  }
  else{
    return(
      <Box
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <Heading as={(titleTag as any)} textStyle="worktitle" mt="auto" mb="2rem">
          {exhibition?.title}
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {assembledSubtitle}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(exhibition?.dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(exhibition?.dateEnd).toLocaleDateString("de")}
        </chakra.p>
      </Box>
    )
  }
};

const createCuratorLink = (curator) => {
  let name = curator.user.pseudonym ? curator.user.pseudonym : curator.user.ethAddress.slice(0, 8) + "…";
  let url = `/u/${curator.user.ethAddress}`
  console.log("Curator: ", name, url);
  return (
    <a href={url}>{name}</a>
  )
}
