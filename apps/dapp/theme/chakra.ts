import {
  extendTheme,
  withDefaultVariant,
  withDefaultSize,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { components } from "./chakra.components";

// https://smart-swatch.netlify.app/#b248bb

const themeConfig = {
  fonts: {
    heading: "Raleway",
    body: "Open Sans",
  },
  components,
  breakpoints: createBreakpoints({
    // 16px default font size * ...em
    mn: "0em", // 0px - aka "Mobile Narrow"
    sm: "22em", // ~360px < Chakra requirement don't use
    m: "22em", // ~360px - aka "Mobile"
    md: "30em", // ~480px < Chakra requirement don't use
    mw: "30em", // ~480px - aka "Mobile wide"
    lg: "45em", // 720px < Chakra requirement don't use
    t: "45em", // 720px - aka "Tablet"
    xl: "55em", // 880px < Chakra requirement don't use
    tw: "55em", // 880px - aka "Tablet Wide"
    d: "75em", // 1200px - aka "Desktop"
    s: "106em", // ~1700px - aka "Screen"
  }),
  styles: {
    global: {
      "html, body": {
        color: "gray.900",
        lineHeight: "tall",
        margin: 0,
        padding: 0,
        height: "100%",
      },
      "#root": {
        height: "100%",
      },
      body: {
        minHeight: "100%",
        bgGradient: "linear(-45deg, rgb(222,240,244), rgb(148,187,233)) fixed",
        bgAttachment: "fixed",
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
          boxShadow: "outline",
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
        fontFamily: "Open Sans, Helvetica, Arial, sans-serif",
      },
    },
  },
  colors: {
    wine: {
      50: "#fde9ff",
      100: "#ebc6ed",
      200: "#d9a1de",
      300: "#c97dd0",
      400: "#b958c1",
      500: "#9f3ea7",
      600: "#7d2f83",
      700: "#59225e",
      800: "#37133a",
      900: "#170418",
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
    outline: "0 0 0 3px rgba(255, 153, 225, 0.6)",
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
      fontSize: ["36px", "48px"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
  },
};

const defaultPropsForFormComponentents = (components: string[]): object => {
  return {
    components: components.reduce((options, key) => {
      return {
        ...options,
        [key]: {
          defaultProps: {
            focusBorderColor: "gray.500",
            errorBorderColor: "red.400",
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
    colorScheme: "wine",
    components: ["Button", "Badge", "Checkbox", "Switch"],
  }),
  withDefaultVariant({
    variant: "solid",
    components: ["Button", "IconButton"],
  }),
  withDefaultVariant({
    variant: "outline",
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

if (typeof window !== "undefined")
  console.log(chakraTheme);
  
export default chakraTheme;
