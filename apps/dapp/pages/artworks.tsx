import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import {
  Box,
  Grid,
  Flex,
  chakra,
  AspectRatio
} from "@chakra-ui/react";

export const Artworks = (props) => {

  return <>Test</>
}

Artworks.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank light>{page}</LayoutBlank>;
};

export default Artworks;
