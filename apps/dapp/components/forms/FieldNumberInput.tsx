import React, { useRef, useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import {
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Box,
} from "@chakra-ui/react";

import FieldErrorMessage from "./FieldErrorMessage";

export interface FieldNumberSettings {
  onChange?: (value: number) => void;
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
  precision?: number;
  step?: number;
  key?: string;
  name?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  valid?: boolean;
}

export const FieldNumberInput = ({
  settings,
  id,
  label,
  name,
  isRequired,
  isDisabled,
}: {
  settings?: FieldNumberSettings;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  name: string;
}) => {
  const fieldRef = useRef<HTMLInputElement | null>(null);

  let defaultValue = settings?.defaultValue ?? "0.00";
  if (typeof defaultValue !== "string")
    defaultValue = defaultValue.toString();

  const [fieldValue, setFieldValue] = useState(defaultValue);

  const format = (val) => {
    let num = val;

    if (Number.isNaN(val))
      num = "0.00";

    if (typeof val !== "string")
      num = val.toString();
    
    return num;
  };

  const {
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useFormContext();

  const onChangeHandler = (value: number) => {
    settings?.onChange && settings?.onChange.call(null, value);
  };

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
          {settings?.icon ? <>{settings.icon} </> : null}
          {label}
        </FormLabel>
        {settings?.helpText && (
          <FormHelperText>{settings?.helpText}</FormHelperText>
        )}

        <Controller
          control={control}
          name={name}
          // render={({ field: { onChange, onBlur, value, ref } }) => {
          render={({ field: { ref, ...restField } }) => {
            return (
              <NumberInput
                {...{
                  ...restField,
                  onBlur: (event) => {
                    restField.onBlur();
                    onChangeHandler(restField.value);
                  },
                  onChange: (valueAsString, valueAsNumber) => {
                    setFieldValue(valueAsString);
                    restField.onChange(valueAsNumber);
                    onChangeHandler(valueAsNumber);
                  },
                }}
                value={format(fieldValue)}
                defaultValue={settings.defaultValue}
                max={
                  typeof settings?.max !== "undefined"
                    ? settings.max
                    : undefined
                }
                min={
                  typeof settings?.min !== "undefined"
                    ? settings.min
                    : undefined
                }
                precision={
                  typeof settings?.precision !== "undefined"
                    ? settings.precision
                    : undefined
                }
                step={
                  typeof settings?.step !== "undefined"
                    ? settings.step
                    : undefined
                }
                keepWithinRange={!!(settings.min || settings.max)}
                clampValueOnBlur={!!(settings.min || settings.max)}
              >
                <NumberInputField
                  variant="flushed"
                  ref={ref}
                  name={restField.name}
                  _placeholder={{
                    opacity: "0.6",
                    color: "white",
                  }}
                  border="0"
                  placeholder={settings.placeholder}
                />
              </NumberInput>
            );
          }}
        />
      </Box>
    </FormControl>
  );
};

export default FieldNumberInput;
