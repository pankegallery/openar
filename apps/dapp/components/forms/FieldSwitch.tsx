import React from "react";
import { Switch, FormControl, Flex, Text, FormLabel, FormHelperText } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { FieldErrorMessage } from ".";

export const FieldSwitch = ({
  name,
  label,
  hint,
  isChecked,
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  defaultChecked = false,
  colorScheme,
}: {
  name: string;
  label: string | React.ReactNode;
  hint?: string;
  isChecked?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  defaultChecked?: boolean;
  colorScheme?: string;
}) => {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext();

  return (
    <FormControl
      mt="1"
      {...{ isRequired, isDisabled, isReadOnly }}
      isInvalid={!!errors[name]?.message}
      p="6"
    >
      <Flex alignItems="center">
        <Switch
          id={name}
          mt="1"
          key={`key-${name}`}
          isInvalid={!!errors[name]?.message}
          
          {...{
            isRequired,
            isDisabled,
            isReadOnly,
            defaultChecked,
            colorScheme,
            isChecked: typeof isChecked !== "undefined" && !!isChecked ? true : false
          }}
          {...register(name, { required: isRequired })}
          display="flex"
        >
          <FormLabel>{label}</FormLabel>
        </Switch>
        
      </Flex>
      {hint && <FormHelperText fontSize="sm">{hint}</FormHelperText>}
      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};
