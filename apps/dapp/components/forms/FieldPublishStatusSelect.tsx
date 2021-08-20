import { useFormContext, Controller } from "react-hook-form";
import { PublishStatus } from "~/utils";
import { PermissionName } from "~/appuser";

import { FormControl, FormLabel, Select } from "@chakra-ui/react";

import FieldErrorMessage from "./FieldErrorMessage";
import { useAuthentication } from "~/hooks";

export const FieldPublishStatusSelect = ({
  status,
  module,
  ownerId,
}: {
  status: PublishStatus;
  module: string;
  ownerId: number;
}) => {
  const [appUser] = useAuthentication();

  const name = "status";
  const id = "status";

  const label = "Publish status";

  const {
    formState: { errors },
    control,
  } = useFormContext();

  const options = [
    {
      value: PublishStatus.DRAFT,
      label: "Draft",
    },
    {
      value: PublishStatus.FORREVIEW,
      label: "For review",
    },
    {
      value: PublishStatus.REJECTED,
      label: "Rejected",
      disabled: !appUser?.has("editor"),
    },
    {
      value: PublishStatus.PUBLISHED,
      label: "Published",
      disabled: !appUser?.has("editor"),
    },
    {
      value: PublishStatus.TRASHED,
      label: "Trashed",
      disabled: !(
        appUser?.has("editor") ||
        (appUser?.is("contributor") &&
          appUser?.can(`${module}DeleteOwn` as PermissionName) &&
          ownerId === appUser.id)
      ),
    },
  ];

  return (
    <FormControl id={id} isInvalid={errors[name]?.message} isRequired>
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
            onChange={onChange}
            isRequired
            defaultValue={
              status === PublishStatus.AUTODRAFT ? PublishStatus.DRAFT : status
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

export default FieldPublishStatusSelect;
