import { User, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import type { RoleName } from "../apiuser";

import {
  daoUserCreate,
  daoUserDelete,
  daoUserUpdate,
  daoUserGetById,
  daoUserCheckIsEmailTaken,
} from "../dao/user";

import { daoTokenDeleteMany } from "../dao/token";

import { AuthPayload } from "../types/auth";

import { tokenGenerateAuthTokens } from "./serviceToken";
import { authSendEmailConfirmationEmail } from "./serviceAuth";
import { ApiError } from "../utils";
import { getApiConfig } from "../config";

const apiConfig = getApiConfig();

export const userRegister = async (
  data: Prisma.UserCreateInput
): Promise<AuthPayload> => {
  if (!apiConfig.enablePublicRegistration)
    throw new ApiError(httpStatus.FORBIDDEN, "Access denied");

  if (!data.acceptedTerms)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Please accept our terms and conditions"
    );

  if (!data.ethAddress)
    throw new ApiError(httpStatus.BAD_REQUEST, "Incomplete data");

  const user: User = await daoUserCreate(data);

  if (user) {
    if (user.email && user.ethAddress)
      await authSendEmailConfirmationEmail(
        user.id,
        user.ethAddress,
        user.email
      );

    const authPayload: AuthPayload = await tokenGenerateAuthTokens(
      {
        id: user.id,
        pseudonym: user.pseudonym ?? "",
        ethAddress: data.ethAddress,
      },
      ["user"] as RoleName[]
    );

    authPayload.user = {
      id: user.id,
      ethAddress: data.ethAddress,
      pseudonym: user.pseudonym,
      email: user.email,
    };

    return authPayload;
  }

  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "New user could not be created"
  );
};

export const userCreate = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  if (!data.acceptedTerms)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Please accept our terms and conditions"
    );

  const user: User = await daoUserCreate(data);

  if (user && user.email && user.ethAddress)
    await authSendEmailConfirmationEmail(user.id, user.ethAddress, user.email);

  return user;
};

export const userUpdate = async (
  id: number,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  const userInDb = await daoUserGetById(id);

  let newEmailAddress = false;
  let dbData = data;

  if (data.email && data.email !== userInDb.email) {
    newEmailAddress = true;
    dbData = {
      ...dbData,
      emailVerified: false,
    };
    if (await daoUserCheckIsEmailTaken(data.email as string, id))
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const user: User = await daoUserUpdate(id, dbData);

  if (user.isBanned)
    await daoTokenDeleteMany({
      ownerId: id,
    });

  if (newEmailAddress && user.email && user.ethAddress)
    await authSendEmailConfirmationEmail(user.id, user.ethAddress, user.email);

  return user;
};

export const userRead = async (id: number): Promise<User> => {
  if (Number.isNaN(id))
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid input data");

  return daoUserGetById(id);
};

export const userDelete = async (id: number): Promise<User> => {
  if (Number.isNaN(id))
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid input data");

  // TODO: this must more solid,
  // Also other content will have to be taken over by someone else.
  await daoTokenDeleteMany({
    ownerId: id,
  });

  return daoUserDelete(id);
};

export const userProfileUpdate = async (
  id: number,
  data: Prisma.UserUpdateInput
): Promise<User> => userUpdate(id, data);

export default {
  userCreate,
  userUpdate,
  userRead,
  userRegister,
  userProfileUpdate,
};
