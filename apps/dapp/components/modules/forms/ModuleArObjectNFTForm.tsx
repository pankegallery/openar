import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { getArObjectTokenInfoGQL } from "~/graphql/queries";
import { IncompleteOverlay, ShowUrlAndCopy } from "~/components/frontend";
import { ArObjectStatusEnum } from "~/utils";
import { appConfig } from "~/config";
import { FieldRow, FieldNumberInput } from "~/components/forms";
import LogoXDAI from "~/assets/img/xdai/xdai-white.svg";
import { useFormContext } from "react-hook-form";
import { WalletActionRequired } from "~/components/frontend";
import { BeatLoader } from "react-spinners";

import {
  OpenAR,
  Decimal,
  stringToHex,
  platformCuts,
  bigNumberToEther,
  numberToBigNumber,
} from "@openar/crypto";
import { useAuthentication, useWalletLogin } from "~/hooks";

export const ModuleArObjectNFTForm = ({ data }: { data: any }) => {
  const { arObjectReadOwn, artworkReadOwn } = data ?? {};
  const [isAwaitingWalletInteraction, setIsAwaitingWalletInteraction] =
    useState(false);
  const [isAwaitingBlockConfirmation, setIsAwaitingBlockConfirmation] =
    useState(false);
  const [cryptoError, setCryptoError] = useState(undefined);
  const { library, account, chainId } = useWalletLogin();
  const [appUser] = useAuthentication();
  const { watch, setValue, reset } = useFormContext();

  const objectURL = `${appConfig.baseUrl}/a/${artworkReadOwn?.key}/${arObjectReadOwn?.key}/`;

  const [subgraphQueryTrigger, subgraphQuery] = useLazyQuery(
    getArObjectTokenInfoGQL,
    {
      variables: {
        arObjectKey: arObjectReadOwn.key,
      },
      context: { clientName: "subgraph" },
    }
  );

  const ownedToken = subgraphQuery?.data?.medias
    ? subgraphQuery?.data?.medias.filter(
        (token) => token.creator.id === token.owner.id
      )
    : [];

  const currentAsk =
    ownedToken.length > 0 && ownedToken[0]?.currentAsk?.amount
      ? bigNumberToEther(ownedToken[0].currentAsk.amount)
      : 0.0;

  
  useEffect(() => {
    subgraphQueryTrigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subgraphQuery.loading || subgraphQuery.error) return;

    if (subgraphQuery.data?.medias) {
      setValue("askPrice", currentAsk);
    }
  }, [
    subgraphQuery.data,
    subgraphQuery.error,
    subgraphQuery.loading,
    currentAsk,
    setValue
  ]);

  const askPrice = watch("askPrice");

  console.log("a", askPrice, "c", currentAsk);
  const setAskForBatch = async (tokenIds: number[], askAmount: number) => {
    let openAR: OpenAR;
    setCryptoError(undefined);

    try {
      if (library && account)
        openAR = new OpenAR(library.getSigner(account), chainId);

      if (!openAR || !appUser) {
        setCryptoError("Could not initialize connection to wallet");
        return;
      }

      setIsAwaitingWalletInteraction(true);

      const ownerCut = Decimal.rawBigNumber(
        Decimal.new(100)
          .value.sub(platformCuts.firstSalePool.value)
          .sub(platformCuts.firstSalePlatform.value)
      );
      const tx = await openAR
        .setAskForBatch(
          tokenIds.map((id) => numberToBigNumber(id)),
          openAR.createAsk(askAmount),
          {
            platform: platformCuts.firstSalePlatform,
            pool: platformCuts.firstSalePool,
            owner: ownerCut,
            creator: Decimal.new(0),
            prevOwner: Decimal.new(0),
          }
        )
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          if (err.message.indexOf("denied transaction") > -1) {
            setCryptoError("You've rejected the transaction");
          } else {
            setCryptoError(err.message);
          }
          // setValue({
          //   askPrice: currentAsk,
          // });
          setValue("askPrice", currentAsk);
        });

      if (!tx) return;

      setIsAwaitingWalletInteraction(false);
      setIsAwaitingBlockConfirmation(true);

      tx.wait(chainId === 31337 ? 0 : appConfig.numBlockConfirmations)
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          setCryptoError(err.message);
          // setValue({
          //   askPrice: currentAsk,
          // });
          setValue("askPrice", currentAsk);
        })
        .finally(() => {
          setTimeout(
            () => {
              subgraphQueryTrigger();
              setIsAwaitingBlockConfirmation(false);
              // setValue({
              //   askPrice: askAmount,
              // });
              setValue("askPrice", askAmount);
            },
            chainId === 31337 ? 5000 : 0
          );
        });
    } catch (err) {
      setIsAwaitingBlockConfirmation(false);
      setCryptoError(err.message);
    }
  };

  const removeAskForBatch = async (tokenIds: number[]) => {
    let openAR: OpenAR;
    setCryptoError(undefined);

    try {
      if (library && account)
        openAR = new OpenAR(library.getSigner(account), chainId);

      if (!openAR || !appUser) {
        setCryptoError("Could not initialize connection to wallet");
        return;
      }

      setIsAwaitingWalletInteraction(true);

      const tx = await openAR
        .removeAskForBatch(tokenIds.map((id) => numberToBigNumber(id)))
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          if (err.message.indexOf("denied transaction") > -1) {
            setCryptoError("You've rejected the transaction");
          } else {
            setCryptoError(err.message);
          }
        });

      if (!tx) return;

      setIsAwaitingWalletInteraction(false);
      setIsAwaitingBlockConfirmation(true);

      tx.wait(chainId === 31337 ? 0 : appConfig.numBlockConfirmations)
        .catch((err) => {
          setIsAwaitingBlockConfirmation(false);
          setCryptoError(err.message);
          // setValue({
          //   askPrice: 0,
          // });
          setValue("askPrice", 0);
        })
        .finally(() => {
          setTimeout(
            () => {
              console.log(123);
              subgraphQueryTrigger();
              setIsAwaitingBlockConfirmation(false);
              // setValue({
              //   askPrice: 0,
              // });
              setValue("askPrice", 0);
              console.log(askPrice, currentAsk);
            },
            chainId === 31337 ? 5000 : 0
          );
        });
    } catch (err) {
      setCryptoError(err.message);
    }
  };

  if (!arObjectReadOwn) return <></>;

  if (
    [
      ArObjectStatusEnum.MINT,
      ArObjectStatusEnum.MINTING,
      ArObjectStatusEnum.MINTRETRY,
      ArObjectStatusEnum.MINTCONFIRM,
    ].includes(arObjectReadOwn?.status)
  )
    return (
      <Box p="6" borderBottom="1px solid #fff">
        Your object is scheduled to be minted as an edition of{" "}
        <b>{arObjectReadOwn.editionOf}</b>. This should be fairly quickly done.
        Please check back in a few minutes
      </Box>
    );

  if ([ArObjectStatusEnum.MINTERROR].includes(arObjectReadOwn?.status))
    return (
      <Box p="6" borderBottom="1px solid #fff" color="openar.error">
        Unfortunately, the mint failed. Please get in touch with us and we&#39;ll
        try to help.
      </Box>
    );

  if ([ArObjectStatusEnum.MINTED].includes(arObjectReadOwn?.status))
    return (
      <>
        {ownedToken.length > 0 && (
          <Box p="6" borderBottom="1px solid #fff">
            <Box border="1px solid #fff" position="relative">
              <FieldRow>
                <FieldNumberInput
                  name="askPrice"
                  isDisabled={
                    subgraphQuery.loading || isAwaitingBlockConfirmation
                  }
                  id="askPrice"
                  label="Price per NFT"
                  isRequired={true}
                  settings={{
                    defaultValue: currentAsk,
                    precision: 2,
                    step: 0.01,
                    min: 0.0,
                    max: 999999999999.0,
                    placeholder: "0.00",
                    helpText: "Ask price for NFT in xDai",
                    icon: (
                      <LogoXDAI
                        className="field-icon price-icon"
                        width="20px"
                        height="20px"
                        viewBox="0 0 150 150"
                      />
                    ),
                  }}
                />
              </FieldRow>

              <HStack p="6" justifyContent="flex-end" spacing="6">
                <Button
                  isDisabled={currentAsk < 0.001}
                  onClick={() => {
                    removeAskForBatch(ownedToken.map((media: any) => media.id));
                  }}
                >
                  Stop selling
                </Button>
                <Button
                  isDisabled={askPrice < 0.001 || askPrice === currentAsk}
                  onClick={() => {
                    setAskForBatch(
                      ownedToken.map((media: any) => media.id),
                      askPrice
                    );
                  }}
                >
                  {currentAsk > 0
                    ? "Change asking price"
                    : "Set new asking price"}
                </Button>
              </HStack>
              {(subgraphQuery.loading || isAwaitingBlockConfirmation) && (
                <IncompleteOverlay
                  headline={
                    isAwaitingBlockConfirmation
                      ? "Awaiting transaction confirmation"
                      : "Loading data"
                  }
                  height="100%"
                  marginLeft="6"
                  marginBottom="0"
                  justifyContent="center"
                  alignItems="center"
                  subline={
                    <Flex w="100%" justifyContent="center" pt="2">
                      <BeatLoader color="#fff" />
                    </Flex>
                  }
                />
              )}
            </Box>
          </Box>
        )}
        <Box p="6" borderBottom="1px solid #fff">
          Your object has been minted as an edition of{" "}
          <b>{arObjectReadOwn.editionOf}</b>
          {ownedToken && ownedToken.length > 0 && (
            <>
              {" "}
              of which <b>{ownedToken.length}</b>{" "}
              {ownedToken.length === 1 ? "is" : "are"} still available to
              collectors
            </>
          )}
          {ownedToken && ownedToken.length === 0 && (
            <> of which all have been sold</>
          )}
        </Box>
        <Box p="6" borderBottom="1px solid #fff">
          <HStack>
            <Box>
              <b>Object URL:</b>
            </Box>
            <Box>
              <ShowUrlAndCopy url={objectURL} />
            </Box>
          </HStack>

          {subgraphQuery?.data?.medias &&
            subgraphQuery?.data?.medias.length > 0 && (
              <Box pt="3">
                <b>NFT Information</b>
                <br />
                <Table variant="simple" w="100%">
                  <Thead>
                    <Tr>
                      <Th color="white" pl="0" w="100px">
                        <chakra.span whiteSpace="nowrap">Token ID</chakra.span>
                      </Th>
                      <Th color="white" pl="0" w="140px">
                        <chakra.span whiteSpace="nowrap">Edition #</chakra.span>
                      </Th>
                      <Th color="white" pl="0" w="30px">
                        Sold
                      </Th>
                      <Th color="white" pl="0">
                        Links
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {subgraphQuery?.data?.medias.map((media: any) => {
                      const url = media.contentURI.split("/");
                      url[url.length - 1] = "index.html";

                      return (
                        <Tr key={`Token-${media.id}`}>
                          <Td valign="top" pl="0">
                            {media.id}
                          </Td>
                          <Td valign="top" pl="0">
                            {media.editionNumber}/{media.editionOf}
                          </Td>
                          <Td valign="top" pl="0">
                            {media.creator.id === media.owner.id ? "No" : "Yes"}
                          </Td>
                          <Td valign="top" pl="0">
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={url.join("/")}
                            >
                              IPFS Deeplink (model viewer)
                            </a>
                            ,
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={url
                                .join("/")
                                .replace("index.html", "info.html")}
                            >
                              IPFS Deeplink (artwork info)
                            </a>
                            ,
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={media.contentURI}
                            >
                              IPFS Content (glb/gltf)
                            </a>
                            ,
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={media.metadataURI}
                            >
                              IPFS Metadata
                            </a>
                            ,
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={media.metadataURI}
                            >
                              IPFS Metadata
                            </a>
                            ,
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={`https://blockscout.com/xdai/mainnet/search-results?q=${media.transactionHash}`}
                            >
                              xDai Transaction
                            </a>
                            ,
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
        </Box>
        <Box p="6" borderBottom="1px solid #fff">
          <b>Minted information</b>
        </Box>
        <WalletActionRequired
          isOpen={isAwaitingWalletInteraction}
          showClose={!!cryptoError}
          onClose={() => {
            setIsAwaitingWalletInteraction(false);
            setCryptoError(false);
          }}
          title="Confirmation required"
          error={cryptoError}
        >
          <Text color="white" mb="4">
            Please confirm the transaction in your wallet.
          </Text>
        </WalletActionRequired>
      </>
    );

  return <></>;
};
