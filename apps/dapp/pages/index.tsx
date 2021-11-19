import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import { ExhibitionSlide } from "~/components/frontend";


import { Box, chakra, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { gql } from "@apollo/client";
import { getApolloClient } from "~/services/apolloClient";

import { useAuthentication } from "~/hooks";

export const Home = (props) => {
  const [appUser] = useAuthentication();
  const beta = process && process.env.NODE_ENV !== "development" && !appUser;

  const exhibitions = [props.exhibition, props.exhibition];
  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${props.pageTitle} · ${props.pageSlogan}`}
          key="title"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={props.pageDescription} />
      </Head>

      <ExhibitionSlide exhibition={props.exhibition} beta={beta}/>

      <Box
        className="betaVersion"
        position="fixed"
        left={{
          base: "auto",
          d: 0,
        }}
        right={{
          base: 0,
          d: "auto",
        }}
        transform={{
          base: "rotate(-90deg)",
          d: "none",
        }}
        bottom="0"
        zIndex="220"
        width={{
          base: "50vw",
          t: "25vw",
        }}
        height={{
          base: "50vw",
          t: "25vw",
        }}
      >
{/*}
        {!beta && (
          <AspectRatio ratio={1}>
            <chakra.img
              src="images/corner.svg"
              width="100%"
              height="100%"
              alt="We are in beta"
            />
          </AspectRatio>
        )}
*/}
        {beta && (
          <chakra.span cursor="pointer">
            <Link href="/beta" passHref>
              <AspectRatio ratio={1}>
                <chakra.img
                  src="images/corner.svg"
                  width="100%"
                  height="100%"
                  alt="We are in beta"
                />
              </AspectRatio>
            </Link>
          </chakra.span>
        )}
      </Box>
    </>
  );
};

// BACKUP: Previous StaticProps wihtout query
//====================================================

//export const getStaticProps = () => {
//  return {
//    props: {
//      pageTitle: "OpenAR",
//      pageSlogan: "The cooperative and crypto platform for AR artworks",
//      pageDescription:
//        "OpenAR makes it easy to exhibit, collect and discuss Augmented Reality (AR) works and allows artists to sell their works as NFTs. The open platform is organised as a cooperative, profits will be shared among the artists.",
//    },
//  };
//};

// WORKAROUND: Selective Exhibition query as workaround
//====================================================

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  const exhibitionQuery = gql`
    query ($slug: String!) {
      exhibition(slug: $slug) {
        id
        slug
        title
        type
        subtitle
        description
        dateBegin
        dateEnd
        status
        curators {
          orderNumber
          user {
            pseudonym
            id
            ethAddress
            bio
            profileImage {
              id
              status
              meta
            }
          }
        }
        artworks {
          id
          key
          title
          description
          creator {
            pseudonym
            ethAddress
          }
          heroImage {
            id
            meta
            status
          }
          arObjects {
            id
            status
            heroImage {
              id
              meta
              status
            }
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: exhibitionQuery,
    variables: {
      slug: 'openar-art',
    },
  });

  return {
    props: {
      pageTitle: "OpenAR",
      pageSlogan: "The cooperative and crypto platform for AR artworks",
      pageDescription:
        "OpenAR makes it easy to exhibit, collect and discuss Augmented Reality (AR) works and allows artists to sell their works as NFTs. The open platform is organised as a cooperative, profits will be shared among the artists.",
      exhibition: data?.exhibition,
    },
    revalidate: 240,
  };
};


// TODO: Exhibitions (all current and upcoming?) query
//====================================================

//export const getStaticProps = async ({ params }: { params: any }) => {
//  const client = getApolloClient();
//
//  const exhibitionQuery = gql`
//    query {
//      exhibitions {
//        id
//        slug
//        title
//        type
//        subtitle
//        description
//        dateBegin
//        dateEnd
//        status
//        curators {
//          orderNumber
//          user {
//            pseudonym
//            id
//            ethAddress
//            bio
//            profileImage {
//              id
//              status
//              meta
//            }
//          }
//        }
//      }
//    }
//  `;
//
//  const { data } = await client.query({
//    query: exhibitionQuery
//  });
//
//  if (
//    !data?.exhibitions
//  ) {
//    return {
//      notFound: true,
//      revalidate: 240,
//    };
//  }
//
//  return {
//    props: {
//      exhibition: data?.exhibition,
//      pageTitle: "OpenAR",
//      pageSlogan: "The cooperative and crypto platform for AR artworks",
//      pageDescription:
//        "OpenAR makes it easy to exhibit, collect and discuss Augmented Reality (AR) works and allows artists to sell their works as NFTs. The open platform is organised as a cooperative, profits will be shared among the artists.",
//    },
//    revalidate: 240,
//  };
//};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Home;
