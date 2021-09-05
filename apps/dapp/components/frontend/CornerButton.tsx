import React from "react";
import { Box, chakra} from "@chakra-ui/react";


export const CornerButton = ({ label }: { label?: String }) => {
  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      width="5rem"
      height="5rem"
      bg="#939180"
      clipPath="polygon(0 0, 100% 0, 100% 100%)"
      _after={{
        content: "''",
        width: "calc(5rem + 1px)",
        height: "calc(5rem + 1px)",
        background: "#fff",
        display: "block",
        position: "absolute",
        top: "-1px",
        left: "-1px",
        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
        zIndex: "-1",
      }}
    >
      <chakra.p textStyle="label">{label}</chakra.p>
    </Box>
  );
};

export default CornerButton;
