import dotenv from "dotenv";

import { validateBidOrAsk, Decimal } from "@openar/crypto";

dotenv.config();

const doChores = async () => {
  for (let i = 0; i < 1.01; i += 0.01) {
    if (
      !validateBidOrAsk(Decimal.new(i.toFixed(2)), {
        platform: Decimal.new(10),
        pool: Decimal.new(5),
        creator: Decimal.new(0),
        owner: Decimal.new(85),
        prevOwner: Decimal.new(0),
      })
    )
      console.log(i);
  }
};

doChores()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    process.exit(1);
  });
