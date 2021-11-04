import { useFormContext } from "react-hook-form";

import { useIsomorphicLayoutEffect } from "~/hooks";

export const FormScrollInvalidIntoView = ({
  hasFormError = false
}: {
  hasFormError?: boolean
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const errorString = JSON.stringify(typeof errors === "object" ? Object.keys(errors) : {});

  useIsomorphicLayoutEffect(() => {
    if (!window) return;

    if (errors || hasFormError) {
      const firstError = document.querySelector("[aria-invalid=\"true\"],.editor.is-error,.form-error");
      
      if (firstError) {
        firstError.scrollIntoView({
          block: 'center',
          behavior: "smooth"
        });
      }

    }
  }, [errorString, errors, hasFormError]);
  return <></>;
};
