import React, {ReactElement} from 'react'
import { LayoutSite } from "~/components/app";
import { Menu } from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import {
  Box,
  Flex,
  chakra
} from "@chakra-ui/react";

function PageTemplate({content, data}) {

  console.log("content: ", content)
  console.log("data: ", data)
  const frontmatter = data

  return (
    <>
      { /* --------- Title and Submenu --------- */}
      <Flex
        position={{
          base: "relative",
          t: "fixed"
        }}
        flexDirection="column"
        bg="white"
        top={{
          base: "0",
          t: "var(--openar-header-height-desktop)",
        }}
        left="0"
        w={{
          base: "100%",
          t: "33.33vw",
        }}
        h={{
          base: "100vw",
          t: "calc(100% - var(--openar-header-height-desktop))",
          d: "33vw"
        }}
        zIndex="200"
        color="black"
        overflow={{
          base: "show",
          t: "hidden"
        }}
        p="6"
        borderRight="1px solid black"
        borderBottom={{
          base: "1px solid black",
          t: "none"
        }}
        pb={{
          base: "10",
          t: "var(--openar-header-height-desktop)",
          d: "0"
        }}
      >

        {frontmatter.parentPage&&
          <Box className="parentPage" mb="4">
            <ArrowLink type="back" href={`/${frontmatter.parentPage[0].url}`}>{frontmatter.parentPage[0].label}</ArrowLink>
          </Box>
        }


        <chakra.h1 textStyle="worktitle" mt={{base: "auto", t: "0"}}>{frontmatter.title}</chakra.h1>

        <Box
          className="subPages"
          mt="auto"
          sx={{
            "a": {
              display: "block",
              mt: "4",
            },
            "a svg": {
              mr: "1"
            }
          }}
        >
          {frontmatter.subPages&&


            frontmatter.subPages.map((pageItem) => (
              <ArrowLink type="to" href={`/${pageItem.url}`}>{pageItem.label}</ArrowLink>
            ))

          }
        </Box>

      </Flex>
      {/* --------- Page content --------- */}
      <Box
        position={{
          base: "relative",
          t: "fixed"
        }}
        top={{
          base: "0",
          t: "var(--openar-header-height-desktop)"
        }}
        left={{
          base: "0",
          t: "33.33vw"
        }}
        p="6"
        pr={{
          base: "6",
          d: "40"
        }}
        h={{
          base: "auto",
          t: "calc(100vh - var(--openar-header-height-desktop))"
        }}
        overflow="scroll"
        pb={{
          base: "10",
          t: "var(--openar-header-height-desktop)",
          d: "0"
        }}
      >

      <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
      </Box>
    </>
  )
}

export const getStaticProps = async (context) => {

  const { slug } = context.params
  let fileContent;

  try {
    // Import our .md file using the `slug` from the URL
     fileContent = await import(`~/content/${slug}.md`)
  } catch(err) {
    return { notFound: true };
  }

  // Parse .md data through matter
  const pageData = matter(fileContent.default)

  //   Pass data to our component props
  return {
    props: {
      content: pageData.content,
      data: pageData.data
    }
  }

}


export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


PageTemplate.getLayout = function getLayout(page: ReactElement) {

  return <LayoutSite>{page}</LayoutSite>;
};

export default PageTemplate
