import { useRef, useEffect } from "react";
import axios from "axios";

export const useAxiosCancelToken = () => {
  const axiosSource = useRef<ReturnType<typeof axios.CancelToken.source>>();
  const createNewCancelToken = () => {
    axiosSource.current = axios.CancelToken.source();
    return axiosSource.current.token;
  };

  const getCancelToken = () => axiosSource?.current?.token;

  const getCanceler = () => axiosSource?.current?.cancel;

  useEffect(
    () => () => {
      if (axiosSource.current) {
        axiosSource.current.cancel();
        axiosSource.current = undefined;
      }
    },
    []
  );

  return {
    createNewCancelToken,
    isCancel: axios.isCancel,
    getCancelToken,
    getCanceler,
  };
};
