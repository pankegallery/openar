import httpStatus from "http-status";
import { ErrorRequestHandler, RequestHandler } from "express";

import { ApiError } from "../utils/ApiError";

export const errorProcessErrors: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
) => {
  if (!err) return next(err);

  if (err && !(err instanceof ApiError)) {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];

    const error = new ApiError(statusCode, message, false, err.stack ?? "");
    res.locals.lastErr = error;
    return next(error);
  }

  if (res?.locals) res.locals.lastErr = err;

  next(err);
};

export const errorDisplayInResponse: ErrorRequestHandler = (
  err,
  _req,
  res /*, next */
) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  if (res?.locals) {
    res.locals.lastErr = err;
  }

  statusCode = statusCode ?? 500;

  const response = {
    code: statusCode,
    message,
    ...(process?.env?.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export const errorConvert404ToApiError: RequestHandler = (_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
};

export default {
  errorConvert404ToApiError,
  errorProcessErrors,
  errorDisplayInResponse,
};
