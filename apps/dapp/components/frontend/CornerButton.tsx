import React from "react";
import { Box, chakra} from "@chakra-ui/react";


export const CornerButton = ({ label, emphasis = false, position = "bottom" }: { label?: String, emphasis?: String, position?: String }) => {

  const bg = emphasis ? "#939180" : "transparent"
  if (position=="top"){
    return (
      <Box
        position="absolute"
        top="0"
        right="0"
        width="5rem"
        height="5rem"
        bg={bg}
        clipPath="polygon(0 0, 100% 0, 100% 100%)"
        display="flex"
        transition="all 0.5s ease"
        _before={{
          content: "''",
          width: "calc(100% + 1px)",
          height: "calc(5rem + 1px)",
          background: "#fff",
          display: "block",
          position: "absolute",
          top: "-1px",
          left: "-1px",
          clipPath: "polygon(0 0, 2px 0, calc(100% + 2px) 100%, 100% 100%)",
          zIndex: "-1",
        }}
        _hover={{
          width:"10rem",
          _before: {
          }
        }}
      >
        <chakra.p textStyle="label" my="6" mr="4" ml="auto">{label}</chakra.p>
      </Box>
    );
  } else {
    return (
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="5rem"
        height="5rem"
        bg={bg}
        clipPath="polygon(0 100%, 100% 0, 100% 100%)"
        display="flex"
        justi
        _before={{
          content: "''",
          width: "calc(100% + 1px)",
          height: "calc(5rem + 1px)",
          background: "#fff",
          display: "block",
          position: "absolute",
          top: "-1px",
          left: "-1px",
          clipPath: "polygon(0 100%, 3px 100%, calc(100% + 3px) 0, 100% 0)",
          zIndex: "-1",
        }}
        _hover={{
          width:"10rem",
          _before: {
          }
        }}
      >
        <chakra.p textStyle="label" pb="6" mr="4" ml="auto" mt="auto">{label}</chakra.p>
      </Box>
    );
  }
};

export default CornerButton;
