import morgan from "morgan";
import { Response, Request } from "express";
import { server } from "../server";
import { logger } from "../services/serviceLogging";

morgan.token("message", (_req: Request, res: Response) => {
  return res?.locals?.lastErr && res?.locals?.lastErr?.name
    ? `- message: ${res?.locals?.lastErr?.name}: ${res?.locals?.lastErr?.message}`
    : "";
});

morgan.token("stack", (_req: Request, res: Response) => {
  if (process?.env?.NODE_ENV !== "development") return "";

  if (
    !res?.locals?.lastErr ||
    (["Error", "ApiError"].includes(res?.locals?.lastErr?.name) &&
      res?.locals?.lastErr?.message === "Not found")
  )
    return "";

  return `${"\n"}STACK: ${res?.locals?.lastErr?.stack}`;
});

const getIpFormat = () =>
  process.env.NODE_ENV === "production" ? ":remote-addr - " : "";

export const morganSuccessHandler = morgan(
  `${getIpFormat()}:method :url :status - :response-time ms`,
  {
    skip: (req: Request, res: Response) => {
      return res.statusCode >= 400 || req.originalUrl === server?.graphqlPath;
    },
    stream: { write: (message) => logger.info(message.trim()) },
  }
);

export const morganErrorHandler = morgan(
  `${getIpFormat()}:method :url :status - :response-time ms :message :stack`,
  {
    skip: (_req, res) => res.statusCode < 400,
    stream: {
      write: (message) => logger.error(message.trim()),
    },
  }
);

export default {
  logger,
  morganSuccessHandler,
  morganErrorHandler,
};
