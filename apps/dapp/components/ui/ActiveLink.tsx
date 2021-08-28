import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'
import { chakra, transition } from '@chakra-ui/react'

export const ActiveLink = ({ children, activeClassName = "active", href, ...props } : {
  children: React.ReactNode;
  activeClassName?: string;
  href: string;
  onClick?: (event: any) => void
}) => {
  const { asPath } = useRouter()

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const className =
    asPath === href || asPath === (props as any).as
      ? `${activeClassName}`.trim()
      : ""

  return (
    
      <Link href={href} passHref>
        <chakra.a {...{className}}
          onClick={(props as any)?.onClick}
          _hover={{
            opacity: 0.6
          }}
          sx={{
            "&.active": {
              color: "var(--chakra-colors-gray-600) !important"
            }
          }}
          transition="all 0.1s"
        >{children}</chakra.a>
      </Link>
      
  )
}

export default ActiveLink
