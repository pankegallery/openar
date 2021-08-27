// Defaults are defined here:
// https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/components

export const components = {
  Button: {
    baseStyle: {
      borderRadius: "md",
      _focus: {
        boxShadow: "none",
      },
      _disabled: {
        color: "white !important"        
      }
    },
    variants: {
      openarBlackAndWhite: {
        border: {
          base: "1px solid",
          tw: "1px solid"
        },
        borderColor: {
          base: "black",
          tw: "white"
        },
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",
        color:  {
          base: "black",
          tw: "white"
        },
        _hover: {
          bg: "transparent",
          borderColor: {
            base: "gray.600",
            tw: "gray.300"
          },
          color: {
            base: "gray.600",
            tw: "gray.300"
          },
        },
      },
      outline: {
        boder: "1px solid #fff",
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",
        color: "white",
        _hover: {
          bg: "transparent",
          borderColor: "gray.300",
          color: "gray.300",
        },
        
      },
      link: {
        boder: "none",
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",
        color: "white",
        p: "0",
        _hover: {
          color: "gray.300",
        },

      },
    },
  },
  Checkbox: {
    baseStyle: {
      control: {
        borderColor: "gray.500",

        _disabled: {
          bg: "gray.100",
          borderColor: "gray.300",
        },
      },
    },
  },
  Divider: {
    baseStyle: {
      borderColor: "gray.300",
      maxW: "80%",
      my: 6,
      mx: "auto",
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          bg: "#fff",
          borderColor: "gray.400",
          _hover: {
            borderColor: "gray.400",
          },
          _autofill: {
            bg: "wine.300",
          },
        },
      },
      flushed: {
        _placeholder: {
          color: "black.900",
        },
        field: {
          _placeholder: {
            color: "black.900",
          },
          fontFamily: "Source code pro, monospace",
          bg: "transparent",
          borderColor: "white",
          _hover: {
            borderColor: "gray.400",
          },
          _autofill: {
            bg: "gray.700",
          },
          p: "0",
        },
      },
    },
  },
  Select: {
    variants: {
      outline: {
        field: {
          bg: "#fff",
          borderColor: "gray.400",
          _hover: {
            borderColor: "gray.500",
          },
          _autofill: {
            bg: "wine.300",
          },
        },
      },
    },
  },
  Link: {
    baseStyle: {
      color: "wine.600",
      transition: "all 0.3s",
      _hover: {
        color: "wine.800",
      },
    },
    variants: {
      outline: {
        boder: "1px solid #fff",
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",

        _hover: {
          bg: "transparent",
          borderColor: "openarGray.300",
          color: "openarGray.300",
        },
        
      },
    }
  },
  Switch: {
    baseStyle: {
      track: {
        bg: "gray.400",
        _invalid: {
          bg: "red.400",
        },
      },
    },
  },
};
