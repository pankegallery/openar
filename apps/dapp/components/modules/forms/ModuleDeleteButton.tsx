import React from "react";

import { Box, Button, useDisclosure, chakra, Flex } from "@chakra-ui/react";

import { DangerZoneAlertDialog } from "~/components/ui";

export const ModuleDeleteButton = ({
  isDisabled,
  buttonLabel,
  dZADTitle,
  dZADMessage,
  dZADRequireTextualConfirmation,
  dZADOnYes,
  dZADOnNo,
}: {
  isDisabled?: boolean;
  buttonLabel: string;
  dZADTitle: string;
  dZADMessage: string;
  dZADRequireTextualConfirmation: boolean;
  dZADOnYes: () => void;
  dZADOnNo?: () => void;
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <>
      <DangerZoneAlertDialog
        title={dZADTitle}
        message={dZADMessage}
        isOpen={!isDisabled && isOpen}
        requireTextualConfirmation={dZADRequireTextualConfirmation}
        onNo={() => {
          if (typeof dZADOnNo === "function") dZADOnNo.call(null);
          onClose();
        }}
        onYes={() => {
          if (typeof dZADOnYes === "function") dZADOnYes.call(null);
          onClose();
        }}
      />
      <Box p="3" borderTop="1px solid #fff" transform="translateY(-1px)">
        <Flex
          p="3"
          border="2px solid"
          borderColor="openar.error"
          justifyContent="space-between"
          alignItems="center"
          sx={
            isDisabled
              ? {
                  opacity: 0.4,
                  pointerEvents: "none",
                }
              : {}
          }
        >
          <chakra.span color="openar.error" textStyle="label">Dangerzone</chakra.span>
          <Button onClick={onToggle}>
            {buttonLabel}
          </Button>
        </Flex>
      </Box>
    </>
  );
};
