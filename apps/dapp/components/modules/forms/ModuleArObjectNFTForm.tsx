import { Box } from "@chakra-ui/react";
import { ArObjectStatusEnum } from "~/utils";

export const ModuleArObjectNFTForm = ({ data }: { data: any }) => {
  const { arObjectReadOwn } = data ?? {};

  if (
    [
      ArObjectStatusEnum.MINT,
      ArObjectStatusEnum.MINTING,
      ArObjectStatusEnum.MINTRETRY,
    ].includes(arObjectReadOwn?.status)
  )
    return (
      <Box p="6" borderBottom="1px solid #fff">
        Your object is scheduled to be minted as NFT. This should be fairly quick. Please check back in about 1 minute
      </Box>
    );

  if (
    [
      ArObjectStatusEnum.MINTERROR,
    ].includes(arObjectReadOwn?.status)
  )
    return (
      <Box p="6" borderBottom="1px solid #fff" color="openar.error">
        Unfortunately, the mint failed. Please get in touch with us and we'll try to help.
      </Box>
    );

  return <div></div>;
};
