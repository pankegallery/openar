import React from "react";
import {
  Box,
  IconButton,
  useClipboard,
} from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

export const ShowUrlAndCopy = ({ url }: { url: string }) => {
  const { hasCopied, onCopy } = useClipboard(url);

  return (
    <Box>
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
      <IconButton
        onClick={onCopy}
        ml={2}
        mt={-1}
        icon={<MdContentCopy />}
        aria-label="copy"
        border="none"
        bg="transparent"
        _hover={{
          bg: "none",
          opacity: 0.6,
        }}
        _active={{
          bg: "transparent",
          color: "green.300",
        }}
        h="30px"
        fontSize="md"
        justifyContent="flex-start"
      >
        {hasCopied ? "Copied" : "Copy"}
      </IconButton>
    </Box>
  );
};
