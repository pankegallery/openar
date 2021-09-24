import Router from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import React, { Children } from "react";
import { chakra, transition } from "@chakra-ui/react";

export const ActiveLink = ({
  children,
  activeClassName = "active",
  href,
  ...props
}: {
  children: React.ReactNode;
  activeClassName?: string;
  href: string;
  onClick?: (event: any) => void;
}) => {
  
  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const className =
    Router.asPath === href || Router.asPath === (props as any).as
      ? `${activeClassName}`.trim()
      : "";

  if (href.indexOf("http") !== -1) {
    return (
      <chakra.a
        htmlref="nofollow"
        {...{ className, href }}
        _hover={{
          opacity: 0.6,
        }}
        sx={{
          "&.active": {
            opacity: "0.6",
          },
        }}
        transition="all 0.1s"
      >
        {children}
      </chakra.a>
    );
  }

  return (
    <Link href={href} passHref>
      <chakra.a
        {...{ className }}
        onClick={(props as any)?.onClick}
        _hover={{
          opacity: 0.6,
        }}
        sx={{
          "&.active": {
            opacity: "0.6",
          },
        }}
        transition="all 0.1s"
      >
        {children}
      </chakra.a>
    </Link>
  );
};

export default ActiveLink;
