interface AddressBook {
  [chainId: number]: {
    [key: string]: string;
  };
}

export const mediaContractName = "openAR";

// TODO: make the address book better, especially the development experience.
export const addresses: AddressBook = {
  100: {
    market: "0xDCB33e41cA2E06B1b402D8129A5B9120ED2dF6cC",
    media: "0x1b5f55D14d2d571EF748c840d1DFa93af5A53aFF",
    weth: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    badges: "0x....",
  },
  31337: {
    market: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    media: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    weth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};
