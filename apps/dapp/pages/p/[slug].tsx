import React from 'react'
import { LayoutSite } from "~/components/app";
import { Menu } from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
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
        position="fixed"
        flexDirection="column"
        bg="white"
        top="var(--openar-header-height-desktop)"
        left="0"
        w={{
          base: "100%",
          t: "33.33vw"
        }}
        h="calc(100vh - var(--openar-header-height-desktop))"
        zIndex="200"
        color="black"
        overflow="hidden"
        p="6"
        borderRight="1px solid black"
      >
        {frontmatter.parentPage&&
          <ArrowLink type="back" href={frontmatter.parentPage[0].url}>{frontmatter.parentPage[0].label}</ArrowLink>
        }

        <chakra.h1 textStyle="worktitle">{frontmatter.title}</chakra.h1>

        <Box className="subPages">
          {frontmatter.subPages&&


            frontmatter.subPages.map((pageItem) => (
              <ArrowLink type="to" href={pageItem.url}>{pageItem.label}</ArrowLink>
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
        top="var(--openar-header-height-desktop)"
        left={{
          base: "100%",
          t: "33.33vw"
        }}
        p="6"
        h={{
          base: "auto",
          t: "calc(100vh - var(--openar-header-height-desktop))"
        }}
        overflow="scroll"
      >

      <ReactMarkdown>{content}</ReactMarkdown>
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
