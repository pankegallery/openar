// Defaults are defined here:
// https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/components

export const components = {
  Button: {
    baseStyle: {
      borderRadius: "md",
      _focus: {
        boxShadow: "button-wine",
      },
    },
    variants: {
      outline: {
        bg: "white",
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
            borderColor: "gray.500",
          },
          _autofill: {
            bg: "wine.300",
          },
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
      _hover: {
        color: "wine.800",
      },
    },
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
