import React from "react";
import { Checkbox, FormControl, Flex } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { FieldErrorMessage } from ".";

export const FieldCheckbox = ({
  name,
  label,
  isRequired = false,
  isDisabled = false,
  defaultChecked = false,
}: {
  name: string;
  label: string | React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  defaultChecked?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      mt="1"
      {...{ isRequired, isDisabled }}
      isInvalid={!!errors[name]?.message}
    >
      <Flex alignItems="center">
        <Checkbox
          id={name}
          mt="1"
          key={`key-${name}`}
          isInvalid={!!errors[name]?.message}
          {...{ isRequired, isDisabled, defaultChecked }}
          {...register(name, { required: isRequired })}
          display="flex"
        >
          {label}
        </Checkbox>
      </Flex>
      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};
