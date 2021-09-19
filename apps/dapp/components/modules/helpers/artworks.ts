import { ArObjectStatusEnum, ArtworkStatusEnum } from "~/utils";

export const isArObjectReadyToMint = (data: any) => {
  if (
    ![ArObjectStatusEnum.PUBLISHED].includes(
      data?.arObjectReadOwn?.status ?? -1
    )
  ) {
    return false;
  }

  if (
    ![ArtworkStatusEnum.PUBLISHED, ArtworkStatusEnum.HASMINTEDOBJECTS].includes(
      data?.artworkReadOwn?.status ?? -1
    )
  ) {
    return false;
  }

  if (!data?.arObjectReadOwn?.heroImage?.id) {
    return false;
  }

  if (
    !data?.arObjectReadOwn?.arModels ||
    !data?.arObjectReadOwn?.arModels?.find((m) => m.type === "glb")
  ) {
    return false;
  }

  if (
    !data?.arObjectReadOwn?.arModels ||
    !data?.arObjectReadOwn?.arModels?.find((m) => m.type === "usdz")
  ) {
    return false;
  }

  return true;
};

export const isArObjectMinting = (data: any) => {
  if (
    [ArObjectStatusEnum.MINT,
      ArObjectStatusEnum.MINTING,
      ArObjectStatusEnum.MINTRETRY,
      ArObjectStatusEnum.MINTED,
      ArObjectStatusEnum.MINTERROR].includes(
      data?.arObjectReadOwn?.status ?? -1
    )
  ) {
    return true;
  }

  return false;
};
