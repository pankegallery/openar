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
  value?: any;
  valid?: boolean;
}

const format = (val: any, precision: number | undefined) => {
  let num = val;

  if (Number.isNaN(val)) return "0.00";

  if (precision && precision > 0) {
    if (typeof num === "number") num = num.toFixed(precision);

    if (typeof num === "string" && num.indexOf(".") > -1) {
      const parts = num.split(".");
      if (parts.length > 1 && parts[1].length === 1) {
        parts[1] = `${parts[1]}0`;
      }
      num = parts.join(".");
    }
  }

  return num;
};

const formatDefaultValue = (val: any, settings: number | undefined) => {
  let defaultValue = format(
    val,
    settings
  );

  if (typeof defaultValue !== "undefined" && defaultValue !== null && typeof defaultValue !== "string")
    defaultValue = defaultValue.toString();
  
  if (!defaultValue)
    return "";

  return defaultValue;
};

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

  const [fieldValue, setFieldValue] = useState(
    formatDefaultValue(settings?.defaultValue, settings?.precision)
  );

  useEffect(() => {
    if (typeof settings?.value !== "undefined")
      setFieldValue(formatDefaultValue(settings?.value, settings?.precision));
  }, [settings?.value, settings?.precision]);

  const {
    formState: { errors },
    setValue,
    getValues,
    control,
    trigger,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    // weirdly restField.onBlur()
                    // sets the field value to undefined
                    // and then the validation fails.
                    // so we have to store it for the moment
                    const v = getValues(restField.name);
                    restField.onBlur();

                    // and reset the value and retrigger the validation again.
                    setValue(restField.name, v);
                    trigger(restField.name);

                    onChangeHandler(v);
                  },
                  onChange: (valueAsString, valueAsNumber) => {
                    setFieldValue(valueAsString);
                    restField.onChange(valueAsNumber);
                    onChangeHandler(valueAsNumber);
                  },
                }}
                value={
                  typeof settings?.value !== "undefined"
                    ? format(fieldValue, settings?.precision)
                    : undefined
                }
                defaultValue={fieldValue}
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
                  ref={(e: HTMLInputElement) => {
                    ref(e);
                    fieldRef.current = e; // you can still assign to ref
                  }}
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
