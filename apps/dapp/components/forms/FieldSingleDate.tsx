import React, { useState } from "react";
import { DateSingleInput } from "@datepicker-react/styled";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

import FieldErrorMessage from "./FieldErrorMessage";

const isValidDate = (d: any) => {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    return !isNaN(d.getTime());
  }
  return false;
};

export const FieldSingleDate = ({
  id,
  label,
  name,
  placeholder,
  isRequired,
  defaultValue,
  displayFormat,
}: {
  id: string;
  isRequired?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: Date | undefined;
  displayFormat?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    formState: { errors },
    control,
    getValues,
  } = useFormContext();

  return (
    <FormControl id={id} isInvalid={errors[name]?.message} {...{ isRequired }}>
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
        }) => {
          const date = isValidDate(value) ? value : defaultValue;
          return (
            <DateSingleInput
              onDateChange={(date) => {
                onChange(date.date);
              }}
              onFocusChange={(focusedInput) => {
                setIsOpen(focusedInput);
              }}
              displayFormat={displayFormat}
              showCalendarIcon={true}
              showClose={false}
              showDatepicker={isOpen}
              showResetDate={false}
              phrases={{
                dateAriaLabel: label,
                datePlaceholder: placeholder ?? "",
                datepickerStartDatePlaceholder: "",
                datepickerStartDateLabel: "",
                datepickerEndDateLabel: "",
                datepickerEndDatePlaceholder: "",
                resetDates: "",
                close: "Close",
              }}
              date={date}
              /* ayLabelFormat={(date: Date) => date.toLocaleString(i18n.language, {day: 'numeric'})} */

              weekdayLabelFormat={(date: Date) =>
                date.toLocaleString("en-GB", { weekday: "short" })
              }
              monthLabelFormat={(date: Date) =>
                date.toLocaleString("en-GB", { month: "long" })
              }
            />
          );
        }}
      />

      <FieldErrorMessage error={errors[name]?.message} />
    </FormControl>
  );
};
