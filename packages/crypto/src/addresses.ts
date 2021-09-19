interface AddressBook {
  [chainId: number]: {
    [key: string]: string;
  };
}

export const mediaContractName = "openAR";

// TODO: make the address book better, especially the development experience.
export const addresses: AddressBook = {
  100: {
    market: "0x....",
    media: "0x....",
    badges: "0x....",
  },
  31337: {
    market: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    media: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    badges: "0x....",
  },
};
