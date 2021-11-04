import React from "react";
import { ActiveLink } from "~/components/ui";


export const Menu = ({ pages, href, target, rel }: { pages?: any; target?: any; rel?: any; }) => {
  return (
    <>
      {pages &&
        pages.map((menuItem) => (
          <ActiveLink key={menuItem.slug} href={`${menuItem.url}`} target={menuItem.target} rel={menuItem.rel}>
            {menuItem.label}
          </ActiveLink>
        ))}
    </>
  );
};

