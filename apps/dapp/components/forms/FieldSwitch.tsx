import React, {ChangeEventHandler} from "react";
import { Switch, FormControl, Flex, chakra, FormHelperText } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

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
  onChangeHandler,
}: {
  name: string;
  label: string | React.ReactNode;
  hint?: string | React.ReactNode;
  isChecked?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  defaultChecked?: boolean;
  colorScheme?: string;
  onChangeHandler?: ChangeEventHandler;
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      mt="1"
      {...{ isRequired, isDisabled, isReadOnly }}
      isInvalid={!!errors[name]?.message}
      p="6"
    >
      <Flex alignItems="center" w="100%">
        <Controller
          control={control}
          name={name}
          defaultValue={typeof defaultChecked === "boolean" ? defaultChecked : false}
          render={({ field: { onChange, onBlur, value } }) => (
            <Switch
              onChange={(e) => {
                onChange(e)
                onChangeHandler && onChangeHandler(e)
              }}
              onBlur={onBlur}
              isDisabled={isDisabled}
              isChecked={typeof isChecked !== "undefined" ? !!isChecked : value}
              isInvalid={errors[name]?.message}
              colorScheme={colorScheme}
              isRequired={isRequired}
              isReadOnly={isReadOnly}
            >
              <chakra.span textStyle="label" fontSize="sm">{label}</chakra.span>
            </Switch>
          )}
        />
      </Flex>
      {hint && <FormHelperText fontSize="sm">{hint}</FormHelperText>}
      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};
