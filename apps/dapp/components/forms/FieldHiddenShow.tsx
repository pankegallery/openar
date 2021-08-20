import { useFormContext } from "react-hook-form";

import { FormControl, FormLabel, Text } from "@chakra-ui/react";

import FieldErrorMessage from "./FieldErrorMessage";

export const FieldHiddenShow = ({
  id,
  label,
  name,
  defaultValue,
  showValue,
  isRequired,
  isDisabled,
}: {
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  name: string;
  showValue: string;
  defaultValue: string | number;
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  return (
    <FormControl
      id={id}
      isInvalid={errors[name]?.message}
      {...{ isRequired, isDisabled }}
    >
      <FormLabel htmlFor={id} mb="0.5">
        {label}
      </FormLabel>

      <input
        {...{ id, defaultValue, required: isRequired ?? undefined }}
        type="hidden"
        {...register("name", {
          required: isRequired,
        })}
      />
      <Text opacity={isDisabled ? 0.4 : 1}>{showValue}</Text>
      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};

export default FieldHiddenShow;
