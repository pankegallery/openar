import React from "react";
import {
  Checkbox,
  Box,
  Flex,
  FormControl,
  RequiredIndicator,
  chakra,
} from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";
import { FieldErrorMessage } from "~/components/forms";

export type FieldRadioOrCheckboxGroupOption = {
  label: string;
  key: string | number;
};

export const FieldRadioOrCheckboxGroup = ({
  id,
  label,
  name,
  type, // TODO: allow for radio boxes ...
  options,
  defaultValues,
  isRequired,
  isDisabled,
}: {
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string | React.ReactNode;
  name: string;
  type: string;
  options: FieldRadioOrCheckboxGroupOption[];
  defaultValues?: any[];
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  if (!options || options.length === 0) return <></>;

  return (
    <FormControl
      id={id}
      isInvalid={errors[name]?.message}
      {...{ isRequired, isDisabled }}
    >
      <chakra.fieldset
        border="1px solid"
        borderColor="gray.400"
        p="2"
        borderRadius="md"
      >
        <legend>
          <chakra.span px="2">
            {label}
            {isRequired && <RequiredIndicator />}
          </chakra.span>
        </legend>

        <Flex flexWrap="wrap">
          {options.map((option, index) => (
            <Controller
              key={`${name}_${index}`}
              control={control}
              name={`${name}[${index}]`}
              defaultValue={defaultValues && defaultValues[index]}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Checkbox
                  value={option.key}
                  onChange={onChange}
                  onBlur={onBlur}
                  isDisabled={isDisabled}
                  isChecked={value}
                  isInvalid={errors[name]?.message}
                  pr="6"
                  isRequired={isRequired}
                  mb="2"
                  maxW={{ base: "50%", t: "33.33%", d: "25%" }}
                >
                  {option.label}
                </Checkbox>
              )}
            />
          ))}
        </Flex>
        <Box transform="translateY(-10px)">
          <FieldErrorMessage error={errors[name]?.message} />
        </Box>
      </chakra.fieldset>
    </FormControl>
  );
};
