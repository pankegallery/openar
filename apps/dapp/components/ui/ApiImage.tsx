import React from "react";
import { BeatLoader } from "react-spinners";
import { Box, chakra, Flex, Text } from "@chakra-ui/react";

import type { ApiImageMetaInformation } from "~/types";
import { ImageStatusEnum } from "~/utils";

import { useImageStatusPoll } from "~/hooks";

export type ApiImageProps = {
  id: number | undefined;
  alt: string;
  title?: string;
  meta?: ApiImageMetaInformation;
  status: ImageStatusEnum;
  forceAspectRatioPB?: number;
  useImageAspectRatioPB?: boolean;
  showPlaceholder?: boolean;
  placeholder?: string;
  sizes?: string;
};

const baseStyle = {
  boxSizing: "border-box",
  p: "4",
  position: "absolute",
  t: 0,
  l: 0,
  w: "100%",
  h: "100%",
  borderWidth: 6,
  borderColor: "white",
  borderStyle: "dashed",
  backgroundColor: "green.300",
  color: "white",
  outline: "none",
  transition: "all .24s ease-in-out",
  cursor: "pointer",
  _before: {
    content: "''",
    position: "absolute",
    border: "4px solid var(--chakra-colors-openar-muddygreen)",
    width: "calc(100% + 4px)",
    height: "calc(100% + 4px)",
    transition: "all .24s ease-in-out",
    bgColor: "#ffffff22",
  },  
};

export const ApiImage = ({
  id,
  alt,
  meta,
  status,
  useImageAspectRatioPB,
  forceAspectRatioPB,
  placeholder,
  showPlaceholder,
  sizes = "100vw",
}: ApiImageProps) => {
  const [polledStatus, polledMeta] = useImageStatusPoll(id, status);

  let content;
  let imageAspectRatioPB;

  if (
    status === ImageStatusEnum.READY ||
    polledStatus === ImageStatusEnum.READY
  ) {
    const aSizes =
      meta?.availableSizes ?? polledMeta?.availableSizes ?? undefined;

    if (aSizes) {
      const originalUrl = aSizes.original?.url ?? "";
      const originalWidth = aSizes.original?.width ?? 0;
      const originalHeight = aSizes.original?.height ?? 0;

      if (useImageAspectRatioPB && originalWidth > 0)
        imageAspectRatioPB = Math.floor(
          (originalHeight / originalWidth) * 100
        );

      const sourceWebp = Object.keys(aSizes).reduce((acc: any, key: any) => {
        const size = aSizes[key];
        if (!size.isWebP) return acc;

        acc.push(`${size.url} ${size.width}w`);
        return acc;
      }, [] as string[]);

      const sourceJpg = Object.keys(aSizes).reduce((acc: any, key: any) => {
        const size = aSizes[key];
        if (!size.isJpg) return acc;

        acc.push(`${size.url} ${size.width}w`);
        return acc;
      }, [] as string[]);

      if (originalUrl) {
        content = (
          <picture>
            {sourceWebp && sourceWebp.length > 0 && (
              <source
                srcSet={sourceWebp.join(",")}
                sizes={sizes}
                type="image/webp"
              />
            )}
            {sourceJpg && sourceJpg.length > 0 && (
              <source
                srcSet={sourceJpg.join(",")}
                sizes={sizes}
                type="image/jpeg"
              />
            )}
            <chakra.img
              src={originalUrl}
              alt={alt}
              width={originalWidth}
              height={originalHeight}
            />
          </picture>
        );
      }
    }
  }

  if (
    !content &&
    (status === ImageStatusEnum.ERROR || polledStatus === ImageStatusEnum.ERROR)
  )
    content = (
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        fontSize="md"
        textAlign="center"
        sx={{...baseStyle,bg:"openar.error"}}
      >
        The image could unfortunately not be processed. Please try uploading
        again.
      </Flex>
    );

  if (
    !content &&
    (status === ImageStatusEnum.UPLOADED ||
      status === ImageStatusEnum.PROCESSING ||
      status === ImageStatusEnum.FAILEDRETRY)
  )
    content = (
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        fontSize="md"
        textAlign="center"
        sx={baseStyle}
      >
        <Text pb="4" w="90%">
          Image uploaded. We are processing it now
        </Text>

        <BeatLoader color="#fff" />
      </Flex>
    );

  if ((!content || !id) && showPlaceholder)
    content = (
      <Flex
        justifyContent="center"
        alignItems="center"
        fontSize="lg"
        color="gray.800"
        border="2px solid"
        bg="gray.100"
        borderColor="gray.100"
        minH="200"
        h="100%"
        p="4"
        textAlign="center"
      >
        {" "}
        {placeholder ?? "Image"}
      </Flex>
    );

  if (content && (forceAspectRatioPB || imageAspectRatioPB)) {
    const aPB = forceAspectRatioPB ?? imageAspectRatioPB;
    content = (
      <Box className="aspect" pb={`${aPB}%`} bg="gray.800">
        <Box className="ratio">{content}</Box>
      </Box>
    );
  }

  return <>{content}</>;
};
