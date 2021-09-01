import { useLayoutEffect, useEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect; // Ensure the name used in components is useLayoutEffect

const out = { useLayoutEffect: useIsomorphicLayoutEffect };
export default out;

