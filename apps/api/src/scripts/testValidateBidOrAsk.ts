import { Decimal } from "@openar/crypto";


const doChores = async () => {
  console.log("First Ask", Decimal.new(123));
  console.log("First Ask");

  // for (let i = 0; i < 100000; i += 0.1) {
  //   if (
  //     // !validateBidOrAsk(∏
  //     //   Decimal.new(i),
  //     //   Decimal.new(10),
  //     //   Decimal.new(5),
  //     //   Decimal.new(0),
  //     //   Decimal.new(0),
  //     //   Decimal.new(0)
  //     // )
  //   )
  //     console.log(`Failed ${i}`);
  // }
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
