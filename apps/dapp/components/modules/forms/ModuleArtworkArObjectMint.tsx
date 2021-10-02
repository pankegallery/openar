import {
  Box,
  Text,
  Heading,  
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { FieldNumberInput, FieldRow, FieldSwitch } from "~/components/forms";
import LogoXDAI from "~/assets/img/xdai/xdai-white.svg";

import { yupIsFieldRequired } from "../validation";

export const ModuleArtworkArObjectMint = ({
  action,
  data,
  errors,
  validationSchema,
  awaitingSignature,
}: {
  action: string;
  data?: any;
  errors?: any;
  validationSchema: any;
  awaitingSignature: boolean
}) => {
  const { arObjectReadOwn } = data ?? {};
  
  const { watch } = useFormContext();

  const [setInitialAsk] = watch(["setInitialAsk"]);

  return (
    <>
      <Box>
        <Box p="6" borderBottom="1px solid #fff">
          <Heading as="h1">Mint {arObjectReadOwn?.title}</Heading>
          <Text>
            Longer description of the minting process, that it <br />
            + That you can choose the edition size between 1 and 100
            <br />+ That you optionally can choose to directly set an asking
            price <br />+ That the mint and the inital set of the ask is paid by
            openAR. <br />
            + That you can later change, remove the ask but you will need to
            have at least ~ 0.01 xDai to pay for the transaction. <br />
            + We need you to sign and once we got you signature we will send the
            minting job to our server and the blockchain
            <br />
            + Will take a few minutes and is irriversible (we will place all the
            NFTs in you wallet)
            <br />
            + That the mint also means that the artwork and the object will be
            permanently published (but both can be hidden on the platform)
            <br />
          </Text>
        </Box>
        <FieldRow>
          <FieldNumberInput
            name="editionOf"
            id="editionOf"
            label="Edition of"
            isDisabled={awaitingSignature}
            isRequired={yupIsFieldRequired("editionOf", validationSchema)}
            settings={{
              defaultValue: 1,
              precision: 0,
              step: 1,
              min: 1,
              max: 100,
              placeholder: "Insert number here…",
              helpText: "Number of NFTs to be minted (1 - 100)",
            }}
          />
        </FieldRow>
        <Box borderBottom="1px solid #fff">
          <FieldRow>
            <FieldSwitch
              isDisabled={awaitingSignature}
              name="setInitialAsk"
              label="Set initial asking price"
              hint="To sell this object as NFT, i.e. mint, the object will be written into the blockchain.
This step cannot be undone. 

Note: an object must be published within a published artwork to be minted."
            />
          </FieldRow>
        </Box>
        {setInitialAsk && (
          <FieldRow>
            <FieldNumberInput
              name="askPrice"
              id="askPrice"
              label="Price per NFT"
              isDisabled={awaitingSignature}
              isRequired={yupIsFieldRequired("price", validationSchema)}
              settings={{
                precision: 2,
                step: 0.01,
                min: 0.0,
                max: 999999999999.0,
                placeholder: "0.00",
                helpText: "Initial price for object in xDai",
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
        )}
      </Box>
    </>
  );
};
export default ModuleArtworkArObjectMint;
