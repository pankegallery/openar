import React from "react";
import { ActiveLink } from "~/components/ui";


export const Menu = ({ pages }: { pages?: any }) => {
  return (
    <>
      {pages &&
        pages.map((menuItem) => (
          <ActiveLink key={menuItem.slug} href={`${menuItem.url}`}>
            {menuItem.label}
          </ActiveLink>
        ))}
    </>
  );
};

