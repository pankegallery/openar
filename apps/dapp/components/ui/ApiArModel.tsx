import React, { useEffect, useState } from "react";
import { AspectRatio, Box, Button } from "@chakra-ui/react";
import { primaryInput } from "detect-it";
import BoxIcon from "~/assets/img/box.svg";

export type ApiArModelProps = {
  alt?: string;
  bg?:string;
  urlUsdz?: string;
  urlGlb?: string;
  urlPoster?: string;
  enforceAspectRatio?: boolean;
  autoplay?: boolean;
  loading?: string;
  reveal?: string;
};

export interface ModelViewerJSX {
  src: string;
  poster?: string;
  loading?: string;
  exposure?: string;
  ar?: any;
  "ar-modes"?: any;
  "ar-scale"?: any;
  "camera-controls"?: any;
  "auto-rotate"?: any;
  alt?: string;
  "ios-src"?: string;  
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export const ApiArModel = ({
  alt,
  urlUsdz,
  urlGlb,
  urlPoster,
  autoplay = false,
  bg = "#ccc",
  loading = "interaction",
  reveal = "auto",
  enforceAspectRatio = false,
}: ApiArModelProps) => {
  const [content, setContent] = useState(<></>)

  useEffect(() => {
    const run = async () => {
      if (typeof window === "undefined")
        return;

      await import("@google/model-viewer")
    }
    run(); 
  },[]);

  useEffect(() => {
    const run = async () => {
      if (typeof window === "undefined")
      return;

      await import("@google/model-viewer")

      let props: any = {};

      if (urlUsdz)
        props = {
          ...props,
          "ios-src": urlUsdz,
        };

      if (urlGlb)
        props = {
          ...props,
          src: urlGlb,
        };

      if (urlGlb)
        props = {
          ...props,
          src: urlGlb,
        };

      if (urlPoster)
        props = {
          ...props,
          poster: urlPoster,
        };

      const isIos = primaryInput === "touch" &&  (navigator.userAgent.indexOf('Safari') != -1 || navigator.userAgent.indexOf('CrIos') != -1)

      let renderNotice = <></>;

      if (!urlGlb && urlUsdz && !isIos)
        renderNotice = <Box position="absolute" p="3" top="50%" transform="translateY(-50%)" textAlign="center" w="100%" color="#666">.usdz file uploaded<br/>This file will be viewable on ios devices</Box>

      if (urlGlb || urlUsdz)
      setContent(
          <model-viewer
            loading={loading}
            reveal={reveal}
            exposure="0.6"
            ar=""
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            camera-controls=""
            auto-rotate=""
            autoplay={autoplay}
            alt={alt}
            {...props}
          >{renderNotice}
            <Button
              borderColor="openar.dark"
              color="openar.dark"
              m="6"
              slot="ar-button" 
            >
              View in AR <BoxIcon viewBox="-10 -7 50 50" width="30px" height="25px" />
            </Button>
       
          </model-viewer>
        );

    }
    run();

  }, [urlGlb, urlUsdz, setContent, urlPoster, alt, autoplay, loading, reveal])

  return <>
    {enforceAspectRatio && <AspectRatio ratio={1} bg={bg}>{content}</AspectRatio>}
    {!enforceAspectRatio && content}
  </>;
};
