import React from "react";
import { Box, chakra, LinkBox, LinkOverlay } from "@chakra-ui/react";

const Wrapper = ({
  children,
  styles,
  isDisabled,
}: {
  children: React.ReactNode;
  styles: any;
  isDisabled: boolean;
}) => {
  return (
    <Box
      position="absolute"
      top={styles.top}
      bottom={styles.bottom}
      right="0"
      width="5rem"
      height="5rem"
      bg={styles.bg}
      clipPath={styles.trianglePath}
      cursor={styles.cursor}
      display="flex"
      transition="all 0.5s ease"
      opacity={isDisabled ? 0.2 : 1}
      _before={{
        content: "''",
        width: "calc(100% + 1px)",
        height: "calc(5rem + 1px)",
        background: "#fff",
        display: "block",
        position: "absolute",
        top: "-1px",
        left: "-1px",
        clipPath: `${styles.borderPath}`,
        zIndex: "-1",
      }}
      _hover={
        !isDisabled
          ? {
              width: "10rem",
              bg: `${styles.bghover}`,
            }
          : {}
      }
    >
      {children}
    </Box>
  );
};

const Text = ({
  children,
  position,
  styles,
}: {
  children: any;
  position: any;
  styles: any;
}) => {
  if (position === "top") {
    return (
      <chakra.p
        textStyle="label"
        my="6"
        mr="4"
        ml="auto"
        width="calc(5rem - var(--chakra-space-4))"
        textAlign="right"
        fontSize="xs"
        fontWeight={styles.fw}
        transition="all 0.5s ease"
      >
        {children}
      </chakra.p>
    );
  } else {
    return (
      <chakra.p
        textStyle="label"
        pb="4"
        mr="4"
        ml="auto"
        mt="auto"
        width="calc(5rem - var(--chakra-space-4))"
        textAlign="right"
        fontSize="xs"
        fontWeight={styles.fw}
      >
        {children}
      </chakra.p>
    );
  }
};

export const CornerButton = ({
  label,
  emphasis = false,
  position = "bottom",
  href,
  isDisabled = false,
  onClick,
}: {
  label?: string;
  emphasis?: boolean;
  isDisabled?: boolean;
  position?: string;
  href?: string;
  onClick?: () => void;
}) => {
  const styles = {
    bg: emphasis ? "#939180" : "openar.mudgreen",
    bghover: emphasis
      ? "linear-gradient(206deg, #bab7a1 33%, #737160 100%)"
      : "linear-gradient(337deg, #bab7a1 33%, #737160 100%)",
    fw: emphasis ? "600" : "400",
    trianglePath:
      position === "top"
        ? "polygon(0 0, 100% 0, 100% 100%)"
        : "polygon(0 100%, 100% 0, 100% 100%)",
    borderPath:
      position === "top"
        ? "polygon(0 0, 2px 0, calc(100% + 2px) 100%, 100% 100%)"
        : "polygon(0 100%, 3px 100%, calc(100% + 3px) 0, 100% 0)",
    top: position === "top" ? "0" : "unset",
    bottom: position === "top" ? "unset" : "0",
    cursor: isDisabled ? "default" : "pointer",
  };

  if (href) {
    return (
      <LinkBox as="div" position="unset">
        <Wrapper styles={styles} isDisabled={isDisabled}>
          <Text styles={styles} position={position}>
            <LinkOverlay textDecoration="none" href={href}>
              {label}
            </LinkOverlay>
          </Text>
        </Wrapper>
      </LinkBox>
    );
  } else {
    return (
      <button onClick={onClick} ><Wrapper styles={styles} isDisabled={isDisabled}>
        <Text styles={styles} position={position}>
          {label}
        </Text>
      </Wrapper>
      </button>
    );
  }
};

export default CornerButton;
