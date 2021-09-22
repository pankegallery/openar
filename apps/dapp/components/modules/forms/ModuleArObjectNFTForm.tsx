import { Box, Button, HStack } from "@chakra-ui/react";
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
        Your object is scheduled to be minted as an editon of <b>{arObjectReadOwn.editionOf}</b>. This should be fairly
        quickly done. Please check back in a few minutes
      </Box>
    );

  if ([ArObjectStatusEnum.MINTERROR].includes(arObjectReadOwn?.status))
    return (
      <Box p="6" borderBottom="1px solid #fff" color="openar.error">
        Unfortunately, the mint failed. Please get in touch with us and we'll
        try to help.
      </Box>
    );

  if ([ArObjectStatusEnum.MINTED].includes(arObjectReadOwn?.status))
    return (
      <Box p="6" borderBottom="1px solid #fff">
        Your object has been minted. {arObjectReadOwn.editionOf}
        <br />
        {arObjectReadOwn.setInitialAsk && (
          <Box>Initial ask {arObjectReadOwn.setInitialAsk.toFixed(2)}</Box>
        )}
        <HStack>
          <Button>Change asking price</Button>
          <Button>Stop selling</Button>
        </HStack>
      </Box>
    );

  return <></>;
};
