import React from "react";
import { AnyObject } from "yup/lib/object";
import { ActiveLink } from "~/components/ui";

export const Menu = ({ pages }: { pages?: any }) => {
  return (
    <>
      {pages &&
        pages.map((menuItem: AnyObject) => (
          <ActiveLink
            key={menuItem.slug}
            href={`${menuItem.url}`}
            target={menuItem.target}
            rel={menuItem.rel}
          >
            {menuItem.label}
          </ActiveLink>
        ))}
    </>
  );
};
