import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { useIsomorphicLayoutEffect } from "~/hooks";

export const FormScrollInvalidIntoView = () => {
  const {
    formState: { errors },
  } = useFormContext();

  useIsomorphicLayoutEffect(() => {
    if (!window) return;

    if (errors) {
      const firstError = document.querySelector("[aria-invalid]");
      if (firstError) {

        firstError.scrollIntoView({
          block: 'center',
          behavior: "smooth"
        });
      }
    }
  }, [errors]);
  return <></>;
};
