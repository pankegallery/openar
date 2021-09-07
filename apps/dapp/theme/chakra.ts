import {
  extendTheme,
  withDefaultVariant,
  withDefaultSize,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { pick } from "lodash";
import { components } from "./chakra.components";

// https://smart-swatch.netlify.app/#b248bb

const themeConfig = {
  fonts: {
    heading: "Manrope",
    body: "Manrope",
  },
  components,
  breakpoints: createBreakpoints({
    // 16px default font size * ...em
    mn: "0rem", // 0px - aka "Mobile Narrow"
    sm: "22rem", // ~360px < Chakra requirement don't use
    m: "22rem", // ~360px - aka "Mobile"
    md: "30rem", // ~480px < Chakra requirement don't use
    mw: "30rem", // ~480px - aka "Mobile wide"
    lg: "45rem", // 720px < Chakra requirement don't use
    t: "38rem", // 720px - aka "Tablet"
    xl: "55rem", // 880px < Chakra requirement don't use
    tw: "55rem", // 880px - aka "Tablet Wide"
    d: "75rem", // 1200px - aka "Desktop"
    s: "106rem", // ~1700px - aka "Screen"
  }),
  styles: {
    global: {
      ":root": {
        "--openar-header-height-desktop": "22vh"
      },
      "html, body": {
        color: "gray.900",
        lineHeight: "tall",
        margin: 0,
        padding: 0,
        height: "100%",
        overscrollBehavior: "none",
        "WebkitOverflowScrolling":"touch",
      },
      "#root, #__next": {
        height: "100%",
      },
      a: {
        transitionProperty: "common",
        transitionDuration: "fast",
        cursor: "pointer",
        textDecoration: "none",
        outline: "none",
        _hover: {
          textDecoration: "none",
        },
      },
      "a:not(.chakra-button)": {
        color: "wine.600",
        _hover: {
          color: "wine.800",
        },
        _focus: {
          boxShadow: false,
        },
      },
      "p a": {
        textDecoration: "underline",
      },
      p: {
        mb: "0.6em",
        _last: {
          mb: "0",
        },
      },
      "p + p > button": {
        mt: 2,
      },
      "select,option": {
        fontFamily: "\"Source Code Pro\", monospace",
      },
      ".text h2":{
        fontSize: {
          base: "18px",
          t: "22px",
          d: "22px"
        },
        fontWeight: "semibold",
        lineHeight: "110%",
        letterSpacing: "-1%",
        marginBottom: "1rem",
        marginTop: "2rem",
        _first: {
           marginTop: "0rem",
        }
      },
      ".text h3":{
        fontWeight: "semibold",
        lineHeight: "110%",
        letterSpacing: "-1%",
        marginBottom: "0.5rem",
        marginTop: "2rem",
      },
      ".text ul li":{
        paddingLeft: "2em",
        listStyle: "none",
        position: "relative",
        marginBottom: "0.5rem",
        _before:{
          content: "'—'",
          position: "absolute",
          left: "0.5em",
        }
      },
      ".openar.content": {
        bg: "var(--chakra-colors-openar-muddygreen)",
        color: "#fff",
      },
      "model-viewer": {
        width: "100%",
        height: "100%",
        margin: 0,
        "--poster-color": "#ccc", //
        border: 0,
      },
    },
  },
  colors: {
    openar: {
      muddygreen: "#bab79f",
      light: "#F7F7F7",
      dark: "#555555",
      error: "#FF3E88",
    },
    openarGray: {
      50: "#f8f8f8",
      100: "#d9d9d9",
      200: "#bfbfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#737373",
      600: "#595959",
      700: "#404040",
      800: "#262626",
      900: "#121212",
    },
    openarWhite: {
      50: "#f8f8f8",
      100: "transparent",
      200: "#bfbfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#737373",
      600: "#ffffff",
      700: "#404040",
      800: "#262626",
      900: "#121212",
    },
    openarBlack: {
      50: "#000000",
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
      700: "#000000",
      800: "#000000",
      900: "#000000",
    },
    openarGreen: {
      50: "#f3f5e7",
      100: "#dfdfce",
      200: "#cac8b4",
      300: "#b4b197",
      400: "#9f9d7a",
      500: "#868661",
      600: "#65684b",
      700: "#464a34",
      800: "#2a2d1d",
      900: "#0f1200",
    },
  },
  shadows: {
    xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    outline: "none", // disabled focus ouline for nearly everything
    "button-wine": "0 0 0 3px rgba(178, 72, 187, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none",
    "dark-lg":
      "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px",
  },
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.25rem", // 0.375rem
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  layerStyles: {
    backdropSuperDark: {
      bg: "rgba(0,0,0,0.85)"
    },
    backdropDark: {
      bg: "rgba(0,0,0,0.6)"
    },
    backdropMud: {
      bg: "openar.muddygreen"
    },
    backdropLight: {
      bg: "openar.light"
    },
    backdropExtraDark: {
      bg: "rgba(0,0,0,0.5)"
    },
    backdropBlurred: {
      position: "relative",
      "&:before": {
        content: '""',
        display: "block",
        position:"absolute", 
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
//        filter: "blur(10px)",
        bg: "rgba(100,100,100,0.5)",
        backdropFilter: "blur(20px)",
        backgroundBlendMode: "lighten",
        zIndex: "-50"
      }
    },
    backdropGradient: {
      bg: "linear-gradient(-256deg, rgba(0,0,0,0), rgba(0,0,0,0.4));"
    },
    pageContainerGray: {
      bg: "gray.100",
      borderRadius: "lg",
      shadow: "sm",
    },
    pageContainerWhite: {
      bg: "white",
      borderRadius: "lg",
      shadow: "md",
      p: { base: 4, tw: 5 },
    },
  },
  textStyles: {
    h1: {
      // you can also use responsive styles
      fontSize: ["48px", "72px"],
      fontWeight: "bold",
      lineHeight: "110%",
      letterSpacing: "-2%",
    },
    h2: {
      fontSize: {
        base: "14px",
        t: "22px",
        d: "22px"
      },
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    worktitle: {
      fontSize: {
        base: "26px",
        t: "42px",
        d: "42px"
      },
      fontWeight: "bold",
      lineHeight: "130%",
    },
    subtitle: {
      fontSize: {
        base: "16px",
        t: "22px",
        d: "22px"
      },
      fontWeight: "semibold",
      lineHeight: "130%",
    },
    workmeta: {
      fontSize: {
        base: "16px",
        t: "18px",
        d: "18px"
      },
      fontWeight: "light",
      lineHeight: "110%",
    },
    label: {
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontWeight: "bold",
      fontSize: {
        base: "14px",
        t: "14px",
        d: "14px"
      },
    },
    bigLabel: {
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontWeight: "bold",
      fontSize: {
        base: "18px",
        t: "24px",
        d: "24px"
      },
    },
    small: {
      fontSize: {
        base: "12px",
        d: "14px"
      },
      fontWeight: "light",
      lineHeight: "120%",
    }
  },
};

const defaultPropsForFormComponentents = (components: string[]): object => {
  return {
    components: components.reduce((options, key) => {
      return {
        ...options,
        [key]: {
          defaultProps: {
            focusBoxShadow: false,
            focusBorderColor: "transparent",
            errorBorderColor: "transparent",
          },
        },
      };
    }, {}),
  };
};

export const chakraTheme = extendTheme(
  themeConfig,

  defaultPropsForFormComponentents([
    "Input",
    "Select",
    "Button",
    "NumberInput",
    "PinInput",
  ]),

  withDefaultColorScheme({
    colorScheme: "gray",
    components: ["Button", "Badge", "Checkbox", "Switch"],
  }),
  withDefaultVariant({
    variant: "outline",
    components: ["Button", "IconButton"],
  }),
  withDefaultVariant({
    variant: "flushed",
    components: ["Input", "NumberInput", "PinInput"],
  }),
  withDefaultSize({
    size: "md",
    components: ["Input", "NumberInput", "PinInput", "Button", "Select"],
  }),
  {
    reactDatepicker: {
      daySize: [100, 40],
      fontFamily: "system-ui, -apple-system",
      colors: {
        accessibility: "#D80249",
        selectedDay: "#f7518b",
        selectedDayHover: "#F75D95",
        primaryColor: "#d8366f",
      },
    },
  },
  {
    components: {
      reactDatepicker: {
        baseStyle: {
          color: "wine.600",
        },
      },
    },
  }
);

if (typeof window !== "undefined") console.log(chakraTheme);

export default chakraTheme;
