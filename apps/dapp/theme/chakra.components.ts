// Defaults are defined here:
// https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/components

export const components = {
  Button: {
    baseStyle: {
      borderRadius: "0",
      fontSize: "xs",
      _focus: {
        boxShadow: false,
      },
      _disabled: {
        color: "white !important"        
      },
      _active: {
        bg: "transparent"
      },
      _hover: {
        bg: "transparent"
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
        fontSize: "xs",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        boder: "1px solid #fff",
        bg: "transparent linear-gradient(170deg, #FFFFFF02 0%, #FFFFFF3B 100%) 0% 0% no-repeat padding-box",
        transition: "all 0.4s",
        color: "white",
        _hover: {
          bg: "transparent 0% 0% no-repeat padding-box",
          bgImage: "linear-gradient(132deg, #FFF0 49%, #FFFFFF24 50%, #FFFA 100%), linear-gradient(170deg, #FFFFFF02 0%, #FFFFFF3B 100%)",
        },
        _focus: {
          boxShadow: false,
        }
      },
      link: {
        boder: "none",
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",
        color: "white",
        p: "0",
        _hover: {
          opacity: "0.6",
          textDecoration: "none",
        },
        _focus: {
          boxShadow: false,
        },
        height: "unset",
        fontWeight: "inherit",
      },
      menuLink: {
        boder: "none",
        borderRadius: "0",
        bg: "transparent",
        transition: "all 0.3s",
        color: "white",
        p: "0",
        fontSize: {
          base: "26px",
          t: "42px"
        },
        fontWeight: "bold",
        lineHeight: "130%",
        _hover: {
          opacity: 0.6,
        },

      },
      functional:{
        boder: "none",
        borderRadius: "0",
        bg: "transparent",
        p: "0",
        height: "unset",
        fontWeight: "inherit",
      }
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
    baseStyle:{
      _placeholder: {
          color: "white",
          opacity: "0.6"
        },
    },
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
          color: "white",
          opacity: "0.6"
        },
        field: {
          _placeholder: {
            color: "white",
            opacity: "0.6"
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
          bg: "transparent",
          borderRadius: 0,
          borderColor: "white",
          _hover: {
            borderColor: "white",
          },
          _focus: {
            borderColor: "white",
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
        fontSize: "xs",
        textTransform: "uppercase",
        boder: "1px solid #fff",
        bg: "transparent linear-gradient(170deg, #FFFFFF02 0%, #FFFFFF3B 100%) 0% 0% no-repeat padding-box",
        transition: "all 0.4s",
        color: "white",
        _hover: {
          bg: "transparent 0% 0% no-repeat padding-box",
          bgImage: "linear-gradient(132deg, #FFF0 49%, #FFFFFF24 50%, #FFFA 100%), linear-gradient(170deg, #FFFFFF02 0%, #FFFFFF3B 100%)",
        },
        _focus: {
          boxShadow: false,
        }
      },
    }
  },
  Switch: {
    baseStyle: {
      container: {
        display: "flex",
        flexDirection: "row-reverse",
        width: "100%",
        maxW: "100%",
        mb:1,
        justifyContent: "space-between",
      },
      track: {
        bg: "transparent",
        border: "1px solid white",
        width: "2.5rem",
        padding: "2px 1px",
        _invalid: {
          bg: "openar.error",
        },
        _checked: {
          bg: "openar.muddydark",
        }
      },
      thumb: {
        bg: "transparent linear-gradient(330deg, #FFFFFF50 0%, #FFFFFFfa 50%) 0% 0% no-repeat padding-box",
        width: "1.5rem",
      },
      label: {
        marginLeft: "0",
      }
    },
  },
  FormLabel: {
    baseStyle: {
      fontSize: "sm",
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontWeight: "700",
    },
  },
  FormErrorMessage: {
    baseStyle: {
      fontSize: "md",
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontWeight: "700",
      color: "openar.error"
    }
  },
  Form:{
    baseStyle: {
      helperText: {
        color: "inherit",
        opacity: "0.6",
        marginBottom: "0.5rem",
        marginTop: "0.1rem",
        fontSize: "0.8rem",
      },
      requiredIndicator: {
        color: "white",
      },
    },
  },
};
