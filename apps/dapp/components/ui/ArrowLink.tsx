import React from 'react'
import Link from 'next/link'
import { chakra, Button } from '@chakra-ui/react'


import Arrow from "~/assets/img/arrow.svg";

export const ArrowLink = ({ children, type = "to", href, onClick } : {
  children: React.ReactNode;
  type?: string;
  href?: string;
  onClick?: any;
}) => {
  if (type === "to" && href){
    return(
      <Link href={href} passHref>
        <chakra.a
          _hover={{
            opacity: 0.6
          }}
          transition="all 0.1s"
          className="arrowLink to"
        >
          <Arrow className="arrow" />
          {children}
        </chakra.a>
      </Link>
    );
  }

  if (!href && onClick){
    return(
      <Button
        variant="link"
        className="arrowLink to"
        onClick={onClick}
      >
        <Arrow className="arrow" />
        {children}
      </Button>
    );
  }

  if (type === "back"  && href){
    return(
      <Link href={href} passHref>
        <chakra.a
          _hover={{
            opacity: 0.6
          }}
          transition="all 0.1s"
          textStyle="label"
          className="arrowLink back"
        >
          <Arrow className="arrow back" />
          {children}
        </chakra.a>
      </Link>
    );
  }

  else return <></>

};

export default ArrowLink;
