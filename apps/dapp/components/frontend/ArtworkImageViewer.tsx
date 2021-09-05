import React from "react";
import { useState } from "react";


import { Box, Grid, Flex, chakra, Button, Link } from "@chakra-ui/react";
import BoxIcon from "~/assets/img/box.svg";
import {ArrowLink} from "~/components/ui";

import { ApiImage, ApiArModel } from "~/components/ui";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


export const ArtworkImageViewer = ({ artwork, object, url}: {artwork: any, object: any, url: String}) => {

//  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  let urlUsdz = "";
  let urlGlb = "";
  let modelViewer = "";


  const arObject = object ? object : artwork?.arObjects[0];


//  console.log("[ArtworkImageViewer] artwork: ", artwork);
//  console.log("[ArtworkImageViewer] selected object: ", arObject);


  if(arObject) {

    const [urlGlb, urlUsdz] = arObject?.arModels.reduce(
      (acc: string[], model: any) => {
        if (model.type === "glb")
          return [model?.meta?.originalFileUrl, acc[1]];

        if (model.type === "usdz")
          return [acc[0], model?.meta?.originalFileUrl];
      },
      [undefined, undefined]
    );

    if (urlGlb || urlUsdz) {
      modelViewer = (
        <ApiArModel
          urlGlb={urlGlb}
          urlUsdz={urlUsdz}
          alt={artwork?.title}
          loading="auto"
          reveal="auto"
        />
      );
    }
  }

  /*TODO: Onclick handler on button to open in AR*/
  const arButton = (
    <Button
      borderColor="openar.dark"
      color="openar.dark"
      onlick=""
    >
      View in AR <BoxIcon viewBox="-10 -7 50 50" width="30px" height="25px"/>
    </Button>
  )

  if (artwork.arObjects.length > 1) {
    // Single object view
    return(
      <Box w="calc(100% + calc(var(--chakra-space-6) * 2))" mx="-6" mb="-6" direction="column" >
        <Flex
          w="100%"
          minHeight="400px"
          justifyContent="center"
          alignItems="center"
          direction="column"
          overflow="auto"
          p="6"
        >
          {modelViewer}
          {arButton}
          <chakra.p
            textStyle="copyDark"
            alignSelf="flex-start"
            my="6"
          >{arObject.title}</chakra.p>
        </Flex>
        <Box
          w="100%"
          px="6"
          pb="6"
          bg="openar.light"
        >
          <chakra.h2
            textStyle="label"
            textAlign="center"
            p="3"
          >
            All objects
          </chakra.h2>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="6"
          >
            {
              artwork.arObjects.map(obj => {
//                console.log("[ArtworkImageViewer] mapped obj: ", obj);

                // TODO: Create link (sometimes with object ID, sometimes not…)
                return(
                  <Link passhref href={obj.key}>
                    <ApiImage
                      id={obj?.heroImage?.id}
                      meta={obj?.heroImage?.meta}
                      status={obj?.heroImage?.status}
                      alt={obj?.title}
                      sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
                      forceAspectRatioPB={100}
                    />
                  </Link>
                )

              })
            }
          </Grid>
        </Box>
      </Box>
    );
  } else{
    // Multile object view
    return(
      <Flex w="100%" h="100%" justifyContent="center"
        alignItems="center" direction="column">
        {modelViewer}
        {arButton}
      </Flex>
    );
  }




//  return(

//      <Swiper
//        modules={[Navigation, Pagination, Thumbs]}
//        slidesPerView={1}
//        onSlideChange={() => console.log("slide change")}
//        onSwiper={(swiper) => console.log(swiper)}
//        simulateTouch={false}
//        thumbs={{ swiper: thumbsSwiper }}
//      >
//        {startWith === "image" && (
//          <SwiperSlide key="heroImage">
//            <ApiImage
//              id={artwork?.heroImage?.id}
//              meta={artwork?.heroImage?.meta}
//              status={artwork?.heroImage?.status}
//              alt={artwork?.title}
//              sizes="(min-width: 75rem) 33.33vw, (min-width: 45rem) 50vw, 100vw"
//              forceAspectRatioPB={100}
//            />
//          </SwiperSlide>
//        )}
//        {artwork?.arObjects.length > 0 &&
//          artwork?.arObjects.map((arObject, i) => {
//            if (!arObject?.arModels?.length) return <></>;
//
//            const [urlGlb, urlUsdz] = arObject?.arModels.reduce(
//              (acc: string[], model: any) => {
//                if (model.type === "glb")
//                  return [model?.meta?.originalFileUrl, acc[1]];
//
//                if (model.type === "usdz")
//                  return [acc[0], model?.meta?.originalFileUrl];
//              },
//              [undefined, undefined]
//            );
//
//            return (
//              <SwiperSlide key={`arObjct${i}`}>
//                <ApiArModel
//                  urlGlb={urlGlb}
//                  urlUsdz={urlUsdz}
//                  alt={arObject?.title}
//                  loading="interaction"
//                  reveal="auto"
//                />
//              </SwiperSlide>
//            );
//          })}
//      </Swiper>
//
//      <Swiper
//        modules={[Thumbs]}
//        watchSlidesProgress
//        onSwiper={setThumbsSwiper}
//        slidesPerView={4}
//        freeMode={true}
//      >
//        {startWith === "image" && (
//          <SwiperSlide key="heroImage">
//            <ApiImage
//              id={artwork?.heroImage?.id}
//              meta={artwork?.heroImage?.meta}
//              status={artwork?.heroImage?.status}
//              alt={artwork?.title}
//              sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
//              forceAspectRatioPB={100}
//            />
//          </SwiperSlide>
//        )}
//        {artwork?.arObjects.length > 0 &&
//          artwork?.arObjects.map((arObject, i) => {
//            console.log(arObject);
//            if (!arObject?.heroImage) return <></>;
//
//            return (
//              <SwiperSlide key={`arObjctT${i}`}>
//                <ApiImage
//                  id={arObject?.heroImage?.id}
//                  meta={arObject?.heroImage?.meta}
//                  status={arObject?.heroImage?.status}
//                  alt={arObject?.title}
//                  sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
//                  forceAspectRatioPB={100}
//                />
//              </SwiperSlide>
//            );
//          })}
//      </Swiper>

//  );
};

export default ArtworkImageViewer;
