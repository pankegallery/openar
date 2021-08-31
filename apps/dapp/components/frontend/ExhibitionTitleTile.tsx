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
  const chakraTitleTag = `chakra.${titleTag}`;
  const TitleElement = chakra(titleTag)

//        React.createElement(chakraTitleTag, {textStyle: "worktitle"}, titleContent)

  if (link){
    return (
      <LinkBox
        as="div"
        className="exhibtion title tile"
        display="flex"
        flexDirection="column"
      >
        <TitleElement textStyle="worktitle" mt="auto" mb="2rem">
          <LinkOverlay href={href} passHref>{title}</LinkOverlay>
        </TitleElement>
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
        <TitleElement textStyle="worktitle" mt="auto" mb="2rem">
          {title}
        </TitleElement>
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
