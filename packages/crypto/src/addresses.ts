interface AddressBook {
  [key: string]: {
    [key: string]: string;
  };
}

// TODO: make the address book better, especially the development experience. 
export const addresses: AddressBook = {
  xDai: {
    market: "0x....",
    media: "0x....",
    badges: "0x....",
  },
  development: {
    market: "0x6bC630F6507b1537ade215371aA89f6A64B33345",
    media: "0xF871D54D48255ffC70948E22C044043A6a887B74",
    badges: "0x....",
  },
};
