import {useImperativeHandle, useRef} from "react";

// Better useCallback() which always returns the same (wrapped) function reference and does not require deps array.
// Use this when the callback requires to be same ref across rendering (for performance) but parent could pass a callback without useCallback().
// useEventCallback(): https://github.com/facebook/react/issues/14099#issuecomment-499781277
// WARNING: Returned callback should not be called from useLayoutEffect(). https://github.com/facebook/react/issues/14099#issuecomment-569044797
export function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>()
  useImperativeHandle(ref, () => fn) // Assign fn to ref.current (currentFunc) in async-safe way

  return useRef(((...args: any[]) => {
    const currentFunc = ref.current
    if (!currentFunc) {
      throw new Error('Callback retrieved from useStableCallback() cannot be called from useLayoutEffect().')
    }
    return currentFunc(...args)
  }) as T).current
}
