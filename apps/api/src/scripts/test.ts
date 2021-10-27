/* eslint-disable security/detect-non-literal-fs-filename */
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import logger from "../services/serviceLogging";

import { Bytes, providers, utils, Wallet, BigNumber } from "ethers";

dotenv.config();

const doChores = async () => {
  let gasPrice = 2;
  try {
    const client = axios.create();

    console.log(1);
    await client
      .get("https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle")
      .then(async (response: AxiosResponse<any>) => {
        console.log(2);
        if (response?.data?.average) {
          gasPrice = response?.data?.average;
          console.log(21)
          if (response?.data?.fast) {
            console.log(22)
            gasPrice += (response?.data?.fast - response?.data?.average) * 0.1;

            console.log(
              gasPrice,
              (response?.data?.fast - response?.data?.average) * 0.1
            );
          }
          console.log(response.data);
        }
      })
      .catch((err) => {
        logger.error(
          `mintArObject: GasPriceProvider could not retrieve price from oracle: ${err.message}`
        );
      });

    console.log(3, gasPrice);
    console.log(3, utils.parseUnits(`${gasPrice}`, "gwei"));
    console.log(3, utils.parseUnits(`1.1`, "gwei"));
  
  } catch (Err) {
    logger.error(Err);
    throw Err;
  }
  return gasPrice;
};

doChores()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    logger.error(Err);
    process.exit(1);
  });
