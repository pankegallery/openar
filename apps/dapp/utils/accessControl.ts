import { AuthenticatedAppUser } from "~/appuser";
import { ArtworkStatusEnum } from ".";

export const isArtworkAccessible = (
  artwork: any,
  appUser: AuthenticatedAppUser
) => {
  if (
    (!appUser || (appUser && appUser.id !== artwork?.creator?.id)) &&
    ([
      ArtworkStatusEnum.DRAFT,
      ArtworkStatusEnum.DELETED,
      ArtworkStatusEnum.TRASHED,
    ].includes(artwork.status) ||
      !artwork.isPublic)
  )
    return false;
  
  return true;
};
