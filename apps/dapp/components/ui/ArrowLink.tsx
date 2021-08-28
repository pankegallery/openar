import React from 'react'
import Link from 'next/link'
import { chakra } from '@chakra-ui/react'


import Arrow from "~/assets/img/arrow.svg";

export const ArrowLink = ({ children, type = "to", href } : {
  children: React.ReactNode;
  type?: string;
  href?: string;
}) => {
  console.log(children, type, href)

  if (type === "to"){
    return(
      <Link href={href} passHref>
        <chakra.a
          _hover={{
            opacity: 0.6
          }}
          className="arrowLink"
          transition="all 0.1s"
        >
          <Arrow class="arrow" />
          {children}
        </chakra.a>
      </Link>
    );
  }

  if (type === "back"){
    return(
      <Link href={href} passHref>
        <chakra.a
          _hover={{
            opacity: 0.6
          }}
          className="arrowLink"
          transition="all 0.1s"
          textStyle="label"
        >
          <Arrow class="arrow back" />
          {children}
        </chakra.a>
      </Link>
    );
  }

};

export default ArrowLink;
