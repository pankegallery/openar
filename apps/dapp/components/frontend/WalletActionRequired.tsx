import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  Flex,
  Box,
  ModalBody,
} from "@chakra-ui/react";

import { BeatLoader } from "react-spinners";

export const WalletActionRequired = ({
  isOpen,
  showClose,
  onClose = () => {},
  error,
  title,
  children,
}: {
  isOpen: boolean;
  showClose: boolean;
  onClose?: () => void;
  title: string;
  error?: string;
  children: React.ReactNode;
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent
        color="white"
        pt="0"
        bg="openar.muddygreen"
        borderRadius="0"
      >
        <ModalHeader pb="0">{title}</ModalHeader>
        <ModalBody pb="6">
          {children}
          {error && <Text color="openar.error" my="6">{error}</Text>}
          {!error && (
            <Flex my="6" justifyContent="center">
              <BeatLoader color="#fff" />
            </Flex>
          )}
          {showClose && (
            <Box mt="6">
              <Button onClick={onClose}>Cancel</Button>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
