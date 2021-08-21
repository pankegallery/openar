import type { JwtPayloadAuthenticatedAppUser } from "../apiuser";
import type { PartialRecord } from ".";

export type AuthTokenType =
  | "access"
  | "refresh"
  | "sign"
  | "resetPassword"
  | "verifyEmail";

export type AuthPayloadToken = {
  token: string;
  expires: string;
};

export type AuthPayload = {
  user: JwtPayloadAuthenticatedAppUser | undefined;
  tokens: PartialRecord<AuthTokenType, AuthPayloadToken>;
};
