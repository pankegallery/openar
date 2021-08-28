import React, {ReactElement} from 'react'
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

        {frontmatter.subPages&&
          <Menu pages={frontmatter.subPages} />
        }
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

PageTemplate.getInitialProps = async (context) => {
  const { slug } = context.query


//  // Import our .md file using the `slug` from the URL
  const content = await import(`~/content/${slug}.md`)
  console.log("Content:", content)
//  // Parse .md data through `matter`
  const pageData = matter(content.default)
  console.log("Data:", pageData)
//  //   Pass data to our component props
  return { slug, ...pageData }
}

PageTemplate.getLayout = function getLayout(page: ReactElement) {

  return <LayoutSite>{page}</LayoutSite>;
};

export default PageTemplate
