import React from "react";
import {
  Box,
  LinkBox,
  LinkOverlay,
  chakra,
  Heading,
} from "@chakra-ui/react";

export const ExhibitionTitleTile = ({
  title,
  subtitle,
  exSlug,
  dateBegin,
  dateEnd,
  titleTag="h1",
  link=true,
}: {
  title: string;
  subtitle: string;
  exSlug?: string;
  dateBegin: any;
  dateEnd: any;
  titleTag?: string;
  link?:boolean;
}) => {

  const href = `/e/${exSlug}/`;
  
  if (link){
    return (
      <LinkBox
        as="div"
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <Heading as={(titleTag as any)} textStyle="worktitle" mt="auto" mb="2rem">
          <LinkOverlay href={href} passHref>{title}</LinkOverlay>
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {subtitle}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(dateEnd).toLocaleDateString("de")}
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
          {title}
        </Heading>
        <chakra.p textStyle="subtitle" mb="1rem">
          {subtitle}
        </chakra.p>
        <chakra.p textStyle="workmeta">
          {new Date(dateBegin).toLocaleDateString("de")}
          {" - "}
          {new Date(dateEnd).toLocaleDateString("de")}
        </chakra.p>
      </Box>
    )
  }
};
