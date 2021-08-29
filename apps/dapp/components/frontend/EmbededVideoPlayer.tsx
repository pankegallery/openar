import React from "react";
import { AspectRatio } from "@chakra-ui/react";

export const EmbededVideoPlayer = ({ url }: { url: string }) => {
  const isYoutube = url.indexOf("yout") !== -1;
  const isVimeo = url.indexOf("vimeo") !== -1;

  if (!isVimeo && !isYoutube) return <></>;

  if (isYoutube) {
    const matches = url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
    );

    if (matches && matches.length > 1) {
      const id = matches[1];

      return (
        <AspectRatio ratio={16 / 9} bg="black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${id}`}
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen={true}
          ></iframe>
        </AspectRatio>
      );
    }
  }

  if (isVimeo) {
    try {
      const matches = url.match(/(\d*)/g);

      if (matches && matches.length > 0) {
        const id = matches.filter((v) => v !== "");

        return (
          <AspectRatio ratio={16 / 9} bg="black">
            <iframe
              width="100%"
              height="100%"
              src={`https://player.vimeo.com/video/${id}`}
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen={true}
            ></iframe>
          </AspectRatio>
        );
      }
    } catch (err) {}
    
  }

  return <></>;
};
