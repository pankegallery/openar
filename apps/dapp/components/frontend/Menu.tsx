import React from "react";
import { ActiveLink } from "~/components/ui";

export const Menu = ({pages}) => {
  if(pages){
    return(
      <>
        {
          pages.map(menuItem =>
            <ActiveLink
              key={menuItem.slug}
              href={`/${menuItem.url}`}
            >
              {menuItem.label}
            </ActiveLink>
          )
        }
      </>
    );
  }
  else return null;
}
