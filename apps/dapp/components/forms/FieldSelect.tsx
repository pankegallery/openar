import React, { ChangeEventHandler, ChangeEvent } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { FormControl, FormLabel, Select } from "@chakra-ui/react";

import FieldErrorMessage from "./FieldErrorMessage";

export interface FieldSelectSettings {
  onChange?: ChangeEventHandler;
  required?: boolean;
  key?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  valid?: boolean;
}

export interface FieldSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const FieldSelect = ({
  settings,
  id,
  label,
  name,
  options,
  isRequired,
  isDisabled,
}: {
  settings?: FieldSelectSettings;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  name: string;
  options: FieldSelectOption[];
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  let fieldProps: FieldSelectSettings = {
    key: `key-${id}`,
    name: name,
  };

  if (settings?.defaultValue) fieldProps.defaultValue = settings?.defaultValue;

  fieldProps.className = settings?.className ?? undefined;

  fieldProps.placeholder = settings?.placeholder ?? undefined;

  if (errors[name]?.message) fieldProps.valid = undefined;

  return (
    <FormControl
      id={id}
      isInvalid={errors[name]?.message}
      {...{ isRequired, isDisabled }}
    >
      <FormLabel htmlFor={id} mb="0.5">
        {label}
      </FormLabel>

      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
          formState,
        }) => (
          <Select
            onBlur={onBlur}
            onChange={(event: ChangeEvent) => {
              onChange(event);
              settings?.onChange && settings?.onChange.call(null, event);
            }}
            {...fieldProps}
            size="md"
            ref={ref}
            defaultValue={settings?.defaultValue}
          >
            {options &&
              options.map((option, i) => (
                <option
                  key={`${id}-o-${i}`}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
          </Select>
        )}
      />

      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};

export default FieldSelect;
