import React, { MouseEventHandler } from "react";
import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  HStack,
  Button,
  chakra,
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import type { ModuleAccessRules } from "~/types";
import { useAuthentication } from "~/hooks";
import { ReactElement } from "react";

interface BreadcrumbElement {
  title: string | React.ReactNode;
  path?: string;
}

export interface ButtonListElementLink extends ModuleAccessRules {
  label: string;
  to?: string;
  as?: React.ReactNode;
  isDisabled?: boolean;
  type: "back" | "navigation";
}

export interface ButtonListElementSubmit extends ModuleAccessRules {
  label: string;
  isLoading: boolean;
  isDisabled?: boolean;
  type: "submit";
}

export interface ButtonListElementButton extends ModuleAccessRules {
  label: string;
  isLoading: boolean;
  isDisabled?: boolean;
  onClick: MouseEventHandler;
  type: "button";
}

export interface ButtonListRenderElement extends ModuleAccessRules {
  key?: string;
  to?: string | undefined;
  as?: any;
  onClick?: MouseEventHandler | undefined;
  isLoading?: boolean | undefined;
  isDisabled?: boolean | undefined;
  colorScheme?: string | undefined;
  type?: "submit";
  variant?: string;
}

export type ButtonListElement =
  | ButtonListElementLink
  | ButtonListElementSubmit
  | ButtonListElementButton;

export const ModuleSubNav = ({
  breadcrumb,
  buttonList,
  children,
}: {
  breadcrumb: BreadcrumbElement[];
  buttonList?: ButtonListElement[];
  children?: React.ReactNode;
}) => {
  // TODO: improve look on mobile
  const [appUser] = useAuthentication();

  let permissisionedButtonList: React.ReactNode[] = [];

  if (Array.isArray(buttonList) && buttonList.length) {
    permissisionedButtonList = buttonList.reduce(function (
      pButtonList,
      button,
      index
    ) {
      
      if (button.userIs && !appUser?.has(button.userIs)) return pButtonList;

      if (button.userCan && !appUser?.can(button.userCan)) return pButtonList;

      let buttonProps: ButtonListRenderElement = {
        key: `bl-${index}`,
        variant: "outline",
      };

      let b: ReactElement;
      switch (button.type) {
        case "navigation":
          b = (
            <Link href={`${button.to}`} passHref key={`bl-${index}`}>
              <ChakraLink
                as={Button}
                variant="outline"
                textDecoration="none !important"
                isDisabled={button.isDisabled}
              >
                {button?.label}
              </ChakraLink>
            </Link>
          );
          break;

        case "back":
          b = (
            <Link href={`${button.to}`} passHref key={`bl-${index}`}>
              <ChakraLink
                as={Button}
                variant="outline"
                textDecoration="none !important"
                isDisabled={button.isDisabled}
              >
                {button?.label}
              </ChakraLink>
            </Link>
          );

          break;

        case "submit":
          buttonProps = {
            ...buttonProps,
            type: "submit",
            isLoading: button.isLoading,
            isDisabled: button.isDisabled,
          };
          b = <Button {...buttonProps}>{button?.label}</Button>;
          break;

        case "button":
          buttonProps = {
            ...buttonProps,
            onClick: button.onClick,
            isLoading: button.isLoading,
            isDisabled: button.isDisabled,
          };
          b = <Button {...buttonProps}>{button?.label}</Button>;
          break;
      }

      if (b) pButtonList.push(b);
      return pButtonList;
    },
    [] as React.ReactNode[]);
  }

  return (
    <>
      <Box
        position="sticky"
        top={0}
        zIndex="200"
        height="4rem"
        borderBottom="1px solid #fff"
        bg="openar.muddygreen"
      >
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "flex-start", mw: "center" }}
          direction={{ base: "column", mw: "row" }}
          height="100%"
          px="3"
        >
          <Heading as="h2" fontSize={{ base: "md", t: "2xl" }}>
            {breadcrumb.map((element, index) => {
              if (index < breadcrumb.length - 1) {
                return (
                  <span key={`${index}-s`}>
                    {element?.path ? (
                      <Link href={element?.path} passHref>
                        <chakra.a
                          color="var(--chakra-colors-gray-ff) !important"
                          transition="all 0.3s"
                          _hover={{ opacity: 0.6 }}
                        >
                          {element?.title}
                        </chakra.a>
                      </Link>
                    ) : (
                      <>{element?.title}</>
                    )}

                    <ChevronRightIcon fontSize="1.2em" mt="-0.1em" />
                  </span>
                );
              }
              return <span key={`${index}-sep`}>{element?.title}</span>;
            })}
          </Heading>
          <Box>
            {permissisionedButtonList && permissisionedButtonList.length > 0 && (
              <HStack spacing="2" key="">
                {permissisionedButtonList}
              </HStack>
            )}

            {children}
          </Box>
        </Flex>
      </Box>
    </>
  );
};
export default ModuleSubNav;

/*
Examples
const buttonList: ButtonListElement[] = [
    {
      type: "back",
      to: moduleRootPath,
      label: t("module.button.cancel", "Cancel"),
    },
    {
      type: "navigation",
      to: moduleRootPath,
      label: t("module.button.cancel", "Cancel"),
    },
    {
      type: "submit",
      isLoading: isSubmitting,
      label: t("module.button.update", "Update"),
    },
    {
      type: "button",
      isLoading: isSubmitting,
      onClick: () => _____ ,
      label: "button test",
    },
  ];
*/
