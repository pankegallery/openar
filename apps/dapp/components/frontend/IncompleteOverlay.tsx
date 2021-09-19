
import React from "react";
import { Flex, chakra, Box, Button } from "@chakra-ui/react";

export const IncompleteOverlay = ({
  headline,
  subline,
  button,
  buttonLabel,
  href,
  height,
  marginLeft,
  marginTop,
}: {
  headline?: String;
  subline?: String;
  button?: Boolean;
  buttonLabel?: String;
  href?: String;
  height?: any;
  marginLeft?: any;
  marginTop?: any;
}) => {

  return(
    <Flex
      layerStyle="backdropBlurred"
      w="100%"
      h={height}
      position="absolute"
      clipPath="polygon(10rem 0%, 100% 0, 100% 100%, 0 100%, 0 10rem)"
      zIndex="10"
      display="flex"
      direction="column"
      _before={{
        bg: "#95927fc0"
      }}
      top="0"
      left="0"
      _after={{
        content: "''",
        bg: "white",
        clipPath:
          "polygon(10rem 0, calc(10rem + 2px) 0%, 0 calc(10rem + 2px), 0 10rem)",
        zIndex: "100",
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "block"
      }}
    >
      <Box mr="auto" ml={marginLeft} mb="10" mt={marginTop}>
        <chakra.p textStyle="subtitle">
          {headline}
        </chakra.p>
        <chakra.p pb="6">
          {subline}
        </chakra.p>
        {button && <Button type="submit">{buttonLabel}</Button>}
      </Box>
    </Flex>
  );
}
