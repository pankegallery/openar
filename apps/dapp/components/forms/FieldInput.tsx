import React, {
  ChangeEventHandler,
  ChangeEvent,
  MouseEventHandler,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useBoolean,
  Flex,
  Box,
} from "@chakra-ui/react";

import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import LogoXDAI from "~/assets/img/xdai/xdai-white.svg"

import FieldErrorMessage from "./FieldErrorMessage";

export interface FieldSettings {
  onChange?: ChangeEventHandler;
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  key?: string;
  name?: string;
  icon?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  valid?: boolean;
  autoResize?: {
    min: number;
    max: number;
  };
}

export const FieldInput = ({
  settings,
  id,
  label,
  name,
  type,
  isRequired,
  isDisabled,
}: {
  settings?: FieldSettings;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  name: string;
  type: string;
}) => {
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const [revealFlag, setRevealFlag] = useBoolean();

  let Icon;
  switch (settings?.icon){
    case "price":
      Icon = <LogoXDAI className="field-icon price-icon" width="20px" height="20px" viewBox="0 0 150 150"/>;
      break;
    default:
      Icon = <></>;
  }


  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext();

  let fieldProps: FieldSettings = {
    key: `key-${id}`,
    name: name,
    type: type,
  };

  fieldProps.rows = settings?.rows ?? undefined;

  if (settings?.defaultValue) fieldProps.defaultValue = settings?.defaultValue;

  fieldProps.className = settings?.className ?? undefined;

  fieldProps.autoComplete = settings?.autoComplete ?? undefined;

  fieldProps.placeholder = settings?.placeholder ?? undefined;

  if (errors[name]?.message) fieldProps.valid = undefined;

  const onChangeHandler: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    settings?.onChange && settings?.onChange.call(null, event);

    if (settings?.autoResize) {
      (event.target as HTMLInputElement).style.height = "";
      (event.target as HTMLInputElement).style.height =
        Math.max(
          settings?.autoResize ? settings?.autoResize.min : 0,
          Math.min(
            settings?.autoResize ? settings?.autoResize.min : 1000,
            (event.target as HTMLInputElement).scrollHeight
          )
        ) + "px";
    }
  };

  fieldProps.type = revealFlag ? "text" : fieldProps.type;

  const visibilityClickEvent: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent
  ) => {
    setRevealFlag.toggle();
    fieldRef?.current?.focus();
  };

  const { ref, onBlur, onChange } = register(id, { required: isRequired });

  let input = (
    <Input
      variant="flushed"
      name={name}
      onBlur={(event) => {
        onBlur(event);
        onChangeHandler(event);
      }}
      onChange={(event) => {
        onChange(event);
        onChangeHandler(event);
      }}
      {...fieldProps}
      ref={(e: HTMLInputElement) => {
        ref(e);
        fieldRef.current = e; // you can still assign to ref
      }}
      _placeholder={{
        opacity: "0.6",
        color: "white"
      }}
      border="0"
    />
  );

  // browser auto fill and form initation might be at the wrong times
  // if this happens the "hook forms" does not register the auto filled
  // value and the field does not validate successfully despite being
  // (visibly) filled.
  useEffect(() => {
    let interval = setInterval(() => {
      if (fieldRef.current && fieldRef.current.value) {
        setValue(name, fieldRef.current.value);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  if (type === "password") {
    input = (
      <InputGroup size="md">
        {input}
        <InputRightElement width="2.5rem">
          <IconButton
            border="1px"
            borderColor="gray.300"
            colorScheme="gray"
            color="gray.800"
            aria-label={revealFlag ? "Show" : "Hide"}
            size="sm"
            onClick={visibilityClickEvent}
            h="1.75rem"
            w="1.75rem"
            lineHeight="1.75rem"
            fontSize="1.25rem"
            minW="1.75rem"
            icon={revealFlag ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          />
        </InputRightElement>
      </InputGroup>
    );
  }

  return (
    <FormControl
      id={id}
      isInvalid={errors[name]?.message}
      {...{ isRequired, isDisabled }}
    >
      <Box
        alignItems="center"
        p="6"
        pb="4"
        borderBottom="1px solid #fff"
        borderLeft={errors[name]?.message ? "4px solid " : "0px"}
        borderLeftColor="openar.error"
        pl={errors[name]?.message ? "calc(var(--chakra-space-6) - 4px)" : "6"}
      >
        {errors[name]?.message && (
          <Box
            m={0}
            position="absolute"
            top="0"
            right="0"
            pt="5"
            pr="6"
          >
            <FieldErrorMessage error={errors[name]?.message} />
          </Box>
        )}
        <FormLabel
          htmlFor={id}
          m={0}
        >
          {label}{settings?.icon && Icon}
        </FormLabel>
        {settings?.helpText &&
        <FormHelperText>{settings?.helpText}</FormHelperText>}
        {input}

      </Box>
    </FormControl>
  );
};

export default FieldInput;
