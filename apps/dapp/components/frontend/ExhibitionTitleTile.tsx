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
          {exhibition?.subtitle}
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
          {exhibition?.subtitle}
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
