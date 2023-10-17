import React, { ChangeEventHandler, ChangeEvent } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { FormControl, FormLabel, FormHelperText, Box } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { CheckIcon } from "@chakra-ui/icons";

import FieldErrorMessage from "./FieldErrorMessage";

export interface FieldACSettings {
  onChange?: ChangeEventHandler;
  required?: boolean;
  key?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: any;
  valid?: boolean;
  helpText?: string;
}

export interface FieldACOption {
  value: string;
  label: string;
}

export const FieldAutocomplete = ({
  settings,
  id,
  label,
  name,
  items,
  isRequired,
  isDisabled,
}: {
  settings?: FieldACSettings;
  id: string;
  label: string;
  name: string;
  items: FieldACOption[];
  isRequired?: boolean;
  isDisabled?: boolean;
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  let placeholder = settings?.placeholder ?? undefined;

  const [pickerItems, setPickerItems] = React.useState(items);
  const [selectedItems, setSelectedItems] = React.useState<FieldACOption[]>([]);

  const handleCreateItem = (item: FieldACOption) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: FieldACOption[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  return (
    <FormControl
      id={id}
      isInvalid={errors[name]?.message}
      {...{ isRequired, isDisabled }}
    >
      <Box
        alignItems="center"
        p="6"
        pb="0"
        borderBottom="1px solid #fff"
        borderLeft={errors[name]?.message ? "4px solid " : "0px"}
        borderLeftColor="openar.error"
        pl={errors[name]?.message ? "calc(var(--chakra-space-6) - 4px)" : "6"}
      >
        <FormLabel htmlFor={id} mb="0.5">
          {label}
        </FormLabel>
        {settings?.helpText && (
          <FormHelperText>{settings?.helpText}</FormHelperText>
        )}
        <Controller
          control={control}
          name={name}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <CUIAutoComplete
              placeholder={placeholder}
              label={label}
              onCreateItem={handleCreateItem}
              items={pickerItems}
              selectedItems={selectedItems}
              disableCreateItem={true}
              onSelectedItemsChange={(changes) =>
                handleSelectedItemsChange(changes.selectedItems)
              }
              listStyleProps={{
                bg: "#00000001",
                border: "none",
                borderRadius: "0",
                boxShadow: "inset 0px 0px 1px 1px white",
              }}
              listItemStyleProps={{
                bg: "#00000001",
                fontSize: "0.9em",
                _hover: { bg: '#00000011'},
                _selected: { bg: '#00000011'},
              }}
              inputStyleProps={{
                border: "none",
                pt: "0"
              }}
              hideToggleButton={true}
              tagStyleProps={{
                bg: "transparent",
                border: "1px solid white",
                color: "white",
              }}
              selectedIconProps={{
                color: "white",
                icon: "CheckIcon",
              }}
              labelStyleProps={
                {display: "none"}
              }
              icon={CheckIcon}
            />
          )}
        />

        <FieldErrorMessage error={errors[name]?.message} />
      </Box>
    </FormControl>
  );
};

export default FieldAutocomplete;
