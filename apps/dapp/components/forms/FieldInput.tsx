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
  InputLeftElement,
  InputRightElement,
  IconButton,
  useBoolean,
  Box,
} from "@chakra-ui/react";

import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import FieldErrorMessage from "./FieldErrorMessage";

export interface FieldInputSettings {
  onChange?: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  key?: string;
  name?: string;
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
  leftElement?: any;
  rightElement?: any;
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
  settings?: FieldInputSettings;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  name: string;
  type: string;
}) => {
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const [revealFlag, setRevealFlag] = useBoolean();

  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext();

  let fieldProps: FieldInputSettings = {
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

  const onBlurHandler: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    settings?.onBlur && settings?.onBlur.call(null, event);
  };

  fieldProps.type = revealFlag ? "text" : fieldProps.type;

  const visibilityClickEvent: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent
  ) => {
    setRevealFlag.toggle();
    fieldRef?.current?.focus();
  };

  const { ref, onBlur, onChange } = register(id, { required: isRequired });

  interface inputProps {
    variant: string;
    name: any;
    border: string;
    onBlur: any;
    onChange: any;
    ref: any;
    _placeholder: any;
  }
  let inputProps = {
    variant: "flushed",
    name: name,
    border: "0",
    onBlur: (event) => {
      onBlur(event);
      onBlurHandler(event);
    },
    onChange: (event) => {
      onChange(event);
      onChangeHandler(event);
    },
    ref: (e: HTMLInputElement) => {
      ref(e);
      fieldRef.current = e; // you can still assign to ref
    },
    _placeholder: {
      opacity: "0.6",
      color: "white",
    },
  };

  let input = <Input {...inputProps} {...fieldProps} />;

  // browser auto fill and form initation might be at the wrong times
  // if this happens the "hook forms" does not register the auto filled
  // value and the field does not validate successfully despite being
  // (visibly) filled.
  useEffect(() => {
    let counter = 0;
    let interval = setInterval(() => {
      if (fieldRef.current && fieldRef.current.value) {
        setValue(name, fieldRef.current.value);
        clearInterval(interval);
      }
      if (counter > 6) {
        clearInterval(interval);
      }
      counter += 1;
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [name, setValue]);

  // Adds passsword field elements on right
  if (type === "password") {
    input = (
      <InputGroup size="md">
        <Input {...inputProps} {...fieldProps} pr="2.5rem" />
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

  // Render left/right elements handed over by function
  // Can be either in the form of leftElement: (<Tag>Content</Tag>)
  // or passed as object with a defined width as padding
  // e.g. leftElement: {element: (<Tag>Content</Tag>), padding: "value"}

  if (settings?.leftElement || settings?.rightElement) {
    let leftElement: any, rightElement: any;
    if (settings?.leftElement) {
      leftElement = (
        <InputLeftElement fontFamily="var(--chakra-fonts-mono)" width={settings?.leftElement.padding ? settings?.leftElement.padding : "auto"}>
          {typeof settings?.leftElement === "object" ? settings?.leftElement.element : settings?.leftElement}
        </InputLeftElement>
      )
    }
    if (settings?.rightElement) {
      rightElement = (
        <InputRightElement fontFamily="var(--chakra-fonts-mono)" width={settings?.rightElement.padding ? settings?.rightElement.padding : "auto"}>
          {typeof settings?.rightElement === "object" ? settings?.rightElement.element : settings?.rightElement}
        </InputRightElement>
      )
    }

    input = (
      <Input
        {...inputProps}
        {...fieldProps}
        pl={settings?.leftElement?.padding}
        pr={settings?.rightElement?.padding}
      />
    );

    input = (
      <InputGroup size="md">
        {leftElement}
        {input}
        {rightElement}
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
          <Box m={0} position="absolute" top="0" right="0" pt="5" pr="6">
            <FieldErrorMessage error={errors[name]?.message} />
          </Box>
        )}
        <FormLabel htmlFor={id} m={0}>
          {label}
        </FormLabel>
        {settings?.helpText && (
          <FormHelperText>{settings?.helpText}</FormHelperText>
        )}
        {input}
      </Box>
    </FormControl>
  );
};

export default FieldInput;
