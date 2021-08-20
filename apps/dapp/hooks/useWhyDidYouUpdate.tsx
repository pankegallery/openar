import { useEffect, useRef } from "react";

// Hook
export const useWhyDidYouUpdate = (name: string, props: object) => {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef<object>();
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      let changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        const prevVal = (previousProps as any)?.current[key];
        const newVal = (props as any)[key];
        if (prevVal !== newVal) {
          // Add to changesObj
          changesObj = {
            ...changesObj,
            [key]: {
              from: prevVal,
              to: newVal,
            },
          };
        }
      });
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
};
