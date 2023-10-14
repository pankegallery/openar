import React from "react";
import { Flex, Text, Box, Button } from "@chakra-ui/react";

export const IncompleteOverlay = ({
  headline,
  subline,
  button,
  buttonLabel,
  href,
  height,
  marginLeft,
  marginTop,
  justifyContent,
  alignItems,
  marginBottom,
  cornerRem =  "10rem",
  children,
}: {
  cornerRem?: string;
  headline?: string;
  align?: string;
  subline?: React.ReactNode | string;
  button?: boolean;
  buttonLabel?: string;
  href?: string;
  justifyContent?: string;
  alignItems?: string;
  height?: any;
  marginLeft?: any;
  marginTop?: any;
  marginBottom?: any;
  children?: any;
}) => {
  return (
    <Flex
      layerStyle="backdropBlurred"
      w="100%"
      h={height}
      position="absolute"
      clipPath={`polygon(${cornerRem} 0%, 100% 0, 100% 100%, 0 100%, 0 ${cornerRem})`}
      zIndex="10"
      display="flex"
      direction="column"
      _before={{
        bg: "#95927fc0",
      }}
      top="0"
      left="0"
      _after={{
        content: "''",
        bg: "white",
        clipPath:
          `polygon(${cornerRem} 0, calc(${cornerRem} + 2px) 0%, 0 calc(${cornerRem} + 2px), 0 ${cornerRem})`,
        zIndex: "100",
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "block",
      }}
      justifyContent={justifyContent ?? "flex-start"}
      alignItems={alignItems ?? "flex-start"}
    >
      {
        children ? 
        (
          <Flex flexDirection="column" mx={marginLeft} mb={marginBottom ?? "10"} mt={marginTop} height="100%">
            {headline && <Text textAlign="right" textStyle="subtitle">{headline}</Text>}
            {subline && <Text marginLeft={cornerRem ?? "0rem"} textAlign="right" marginBottom="6">{subline}</Text>}
            <Box flexGrow={1}>{children}</Box>
          </Flex>
        ):(
          <Box mx={marginLeft} mb={marginBottom ?? "10"} mt={marginTop}>
            {headline && <Text textStyle="subtitle">{headline}</Text>}
            {subline && <Text>{subline}</Text>}
            {button && <Box pt="6" mb="6"><Button type="submit">{buttonLabel}</Button></Box>}
          </Box>
        )
      }

    </Flex>
  );
};
