import React, { ReactElement } from "react";
import { LayoutSite } from "~/components/app";
import { Menu } from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeReact from "rehype-react";
import { Box, Flex, chakra } from "@chakra-ui/react";
import { Footer } from "~/components/app/site";

import { useSSRSaveMediaQuery } from "~/hooks";
import { GetStaticProps, GetStaticPaths } from "next";

function PageTemplate({ content, data }) {
  const frontmatter = data;

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45rem) and (max-width: 75rem)"
  );

  return (
    <Flex
      direction="row"
      flexWrap="wrap"
      height={{
        base: "auto",
        d: "100vh",
      }}
      pt={{
        base: "0",
        t: "var(--openar-header-height-desktop)",
      }}
    >
      {/* --------- COL: Title Tile + Footer--------- */}
      <Flex
        direction="column"
        w={{
          base: "100%",
          t: "50vw",
          d: "33.33vw",
        }}
        height={{
          base: "auto",
          d: "100%",
        }}
        borderRight={{
          base: "none",
          t: "1px solid black",
        }}
      >
        {/* --------- TILE: Back + Title + Subpages --------- */}
        <Flex
          flexDirection="column"
          bg="white"
          w={{
            base: "100%",
            t: "50vw",
            d: "33.33vw",
          }}
          flex={{
            base: "100vw 0 0",
            t: "50vw 0 1",
            d: "33vw 0 1;",
          }}
          zIndex="200"
          color="black"
          overflow={{
            base: "show",
            t: "hidden",
          }}
          borderRight="1px solid black"
          borderBottom={{
            base: "1px solid black",
            d: "none",
          }}
          p="6"
        >
          {frontmatter.parentPage && (
            <Box className="parentPage" mb="4">
              <ArrowLink type="back" href={`/${frontmatter.parentPage[0].url}`}>
                {frontmatter.parentPage[0].label}
              </ArrowLink>
            </Box>
          )}

          <chakra.h1 textStyle="worktitle" mt={{ base: "auto", t: "0" }}>
            {frontmatter.title}
          </chakra.h1>

          {frontmatter.subPages && (
            <Box
              className="subPages"
              mt="auto"
              sx={{
                a: {
                  display: "block",
                  mt: "4",
                },
                "a svg": {
                  mr: "1",
                },
              }}
            >
              {frontmatter.subPages.map((pageItem) => (
                <ArrowLink
                  type="to"
                  href={`/${pageItem.url}`}
                  key={pageItem.slug}
                >
                  {pageItem.label}
                </ArrowLink>
              ))}
            </Box>
          )}
        </Flex>

        {isDesktop && <Footer />}
      </Flex>

      {/* --------- Page content --------- */}
      <Box
        position="relative"
        p="6"
        pr={{
          base: "6",
          d: "40",
        }}
        h={{
          base: "auto",
          t: "100%",
        }}
        overflowY="auto"
        pb={{
          base: "10",
          t: "var(--openar-header-height-desktop)",
          d: "6",
        }}
        w={{
          base: "100%",
          t: "50vw",
          d: "66.66vw",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </Box>
      {!isDesktop && <Footer />}
    </Flex>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  let fileContent;

  try {
    // Import our .md file using the `slug` from the URL
    fileContent = await import(`~/content/${slug}.md`);
  } catch (err) {
    return { notFound: true, revalidate: 240 };
  }

  // Parse .md data through matter
  const pageData = matter(fileContent.default);

  //   Pass data to our component props
  return {
    props: {
      content: pageData.content,
      data: pageData.data,
    },
    revalidate: 240,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

PageTemplate.getLayout = function getLayout(page: ReactElement) {
  return <LayoutSite>{page}</LayoutSite>;
};

export default PageTemplate;
