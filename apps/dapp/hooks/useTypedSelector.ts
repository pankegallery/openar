import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "~/redux/store";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
