import React from "react";
import { Box, chakra } from "@chakra-ui/react";

export const CornerButton = ({
  label,
  emphasis = false,
  position = "bottom",
}: {
  label?: String,
  emphasis?: boolean,
  position?: String,
  onClick?: () => void
}) => {
  const bg = emphasis ? "#939180" : "openar.mudgreen";
  const bghover = emphasis
    ? "linear-gradient(337deg, #bab7a1 20%, #737160 90%)"
    : "linear-gradient(337deg, #bab7a1 20%, #737160 90%)";
  const fw = emphasis ? "600" : "400";

  if (position == "top") {
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
          width: "10rem",
          bg: "linear-gradient(206deg, #bab7a1 33%, #737160 100%)",
        }}
      >
        <chakra.p
          textStyle="label"
          my="6"
          mr="4"
          ml="auto"
          width="calc(5rem - var(--chakra-space-4))"
          textAlign="right"
          fontSize="xs"
          fontWeight={fw}
          transition="all 0.5s ease"
        >
          {label}
        </chakra.p>
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
          clipPath: "polygon(0 100%, 3px 100%, calc(100% + 3px) 0, 100% 0)",
          zIndex: "-1",
        }}
        _hover={{
          width: "10rem",
          bg: "linear-gradient(337deg, #bab7a1 33%, #737160 100%)",
        }}
      >
        <chakra.p
          textStyle="label"
          pb="4"
          mr="4"
          ml="auto"
          mt="auto"
          width="calc(5rem - var(--chakra-space-4))"
          textAlign="right"
          fontSize="xs"
          fontWeight={fw}
        >
          {label}
        </chakra.p>
      </Box>
    );
  }
};

export default CornerButton;
