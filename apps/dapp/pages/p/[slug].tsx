import React from 'react'
import { LayoutSite } from "~/components/app";
import { Menu } from "~/components/frontent";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Flex,
  chakra
} from "@chakra-ui/react";

function PageTemplate({content, data}) {

  const metadata = matter(content.default)
  console.log("content: ", content)
  console.log("data: ", metadata)
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
        <chakra.h1 textStyle="worktitle">{frontmatter.title}</chakra.h1>
        MENU {frontmatter.subPages}
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
      {content}
        <ReactMarkdown source={content} />
      </Box>
    </>
  )
}

PageTemplate.getInitialProps = async (context) => {
  const { slug } = context.query

//  // Import our .md file using the `slug` from the URL
  const content = await import(`~/content/${slug}.md`)
//  // Parse .md data through `matter`
  const data = matter(content.default)
//
//  //   Pass data to our component props
  return { slug, ...data }
}

PageTemplate.getLayout = function getLayout(page: ReactElement) {

  return <LayoutSite>{page}</LayoutSite>;
};

export default PageTemplate
