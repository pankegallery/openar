import React, { MouseEventHandler, useState, useEffect } from "react";

import {
  Box,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { walletConntectConnector } from "~/services/crypto";
import { useEthers } from "@usedapp/core";
import user from "~/services/user";

import { useTypedSelector } from "~/hooks";

export const WalletControl = () => {
  const { connected } = useTypedSelector(({ crypto }) => crypto);
  const walletDisclosure = useDisclosure();

  const { account, chainId, error, activate, activateBrowserWallet, deactivate } =
    useEthers();

  console.log(account, chainId, error);


  return (
    <Box>
      <Box
            order={[-1, null, null, 2]}
            textAlign={["left", null, null, "right"]}
          >
            {!connected && <Button
              colorScheme="teal"
              variant="outline"
              onClick={walletDisclosure.onOpen}
            >
              Connect to a wallet
            </Button>}

            {connected && <Button
              colorScheme="teal"
              variant="outline"
              onClick={async () => {
                deactivate();
                await user.logout();                
              }}
            >
              Disconnect
            </Button>}
          </Box>
          <Modal
            isOpen={walletDisclosure.isOpen}
            onClose={walletDisclosure.onClose}
          >
            <ModalOverlay />
            <ModalContent color="black" pt="0">
              <ModalHeader pb="0">Connect to a wallet</ModalHeader>
              <ModalCloseButton />
              <ModalBody >
                <Text color="black" mb="6">
                  Instead of a login we use your wallet to give you access to OpenAR. This is a two step process. 
                  (1) You connect to the wallet, then (2) we ask you sign a transaction (which is free) to give out server a chance to check if you are who you claim you are. 

                </Text>
                <Button
                  justifyContent="space-between"
                  width="100%"
                  mt="4"
                  mb="4"
                  size="lg"
                  variant="outline"
                  rightIcon={
                    <Image
                      width="30px"
                      height="30px"
                      src="/images/logo-metamask.png"
                      alt="MetaMask"
                    />
                  }
                  onClick={async () => {
                    try {
                      const result = await activateBrowserWallet(
                        undefined,
                        true
                      );
                      console.log(account, chainId, result);
                      
                    } catch (err) {
                      console.log(1, err);
                    }
                  }}
                >
                  MetaMask
                </Button>
                <Button
                  justifyContent="space-between"
                  width="100%"
                  mb="4"
                  size="lg"
                  variant="outline"
                  rightIcon={
                    <Image
                      width="30px"
                      height="30px"
                      src="/images/logo-walletconnect.svg"
                      alt="WalletConnect"
                    />
                  }
                  onClick={async () => {
                    try {
                      console.log(1);
                      await activate(
                        walletConntectConnector,
                        (err) => {},
                        true
                      );
                      console.log(2);
                    } catch (err) {
                      console.log(2, err);
                    }
                  }}
                >
                  WalletConnect
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
    </Box>
  )
}
