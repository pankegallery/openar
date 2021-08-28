import { useFormContext, Controller } from "react-hook-form";

import { FormControl, FormLabel, Select, Box } from "@chakra-ui/react";

import FieldErrorMessage from "./FieldErrorMessage";

type StatusOption = {
  value: number;
  label: string;
  isDisabled?: boolean;
}

export const FieldStatusSelect = ({
  status,
  options,
  statusEnum,
}: {
  status: any;
  options: StatusOption[],
  statusEnum: any;
}) => {
  const name = "status";
  const id = "status";

  const label = "Publish status";


  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <FormControl id={id} isInvalid={errors[name]?.message} isRequired>
      <Box alignItems="center" p="3" borderBottom="1px solid #fff">
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
            variant="outline"
            onChange={onChange}
            isRequired
            defaultValue={
              status === statusEnum.AUTODRAFT ? statusEnum.DRAFT : status
            }
            valid={!errors[name]?.message ? "valid" : undefined}
            placeholder="Please choose a publish status"
            size="md"
            ref={ref}
          >
            {options &&
              options.map((option, i) => (
                <option
                  key={`${id}-o-${i}`}
                  value={option.value}
                  disabled={option.isDisabled}
                >
                  {option.label}
                </option>
              ))}
          </Select>
        )}
      />

      <FieldErrorMessage error={errors[name]?.message} />
      </Box>
    </FormControl>
  );
};

export default FieldStatusSelect;
