export default {};

// import httpStatus from "http-status";
// import { Location, Prisma } from "@prisma/client";

// import { ApiError, filteredOutputByBlacklistOrNotFound, filteredOutputByBlacklist } from "../utils";
// import { apiConfig } from "../config";
// import { getPrismaClient } from "../db/client";
// import {
//   daoSharedCheckSlugUnique,
//   daoSharedGenerateFullText,
//   daoSharedWrapImageWithTranslationImage,
//   daoImageTranslatedColumns,
// } from ".";

// const prisma = getPrismaClient();

// const locationFullTextKeys = [
//   "title",
//   "slug",
//   "description",
//   "address",
//   "contactInfo",
//   "offers",
// ];

// export const daoLocationCheckSlugUnique = async (
//   slug: Record<string, string>,
//   id?: number,
//   uniqueInObject?: boolean
// ): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
//   return daoSharedCheckSlugUnique(
//     prisma.location.findMany,
//     slug,
//     id,
//     uniqueInObject
//   );
// };

// export const daoLocationQuery = async (
//   where: Prisma.LocationWhereInput,
//   include: Prisma.LocationInclude | undefined,
//   orderBy: Prisma.LocationOrderByInput | Prisma.LocationOrderByInput[],
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize
// ): Promise<Location[]> => {
//   const locations: Location[] = await prisma.location.findMany({
//     where,
//     include,
//     orderBy,
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     locations,
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationSearchQuery = async (
//   where: Prisma.LocationWhereInput,
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize * 3
// ): Promise<Location[]> => {
//   const locations = await prisma.location.findMany({
//     where,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       lat: true,
//       lng: true,
//     },
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     locations,
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationQueryFirst = async (
//   where: Prisma.LocationWhereInput,
//   include: Prisma.LocationInclude | undefined
// ): Promise<Location> => {
//   const location = await prisma.location.findFirst({
//     where,
//     include,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       location,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationQueryCount = async (
//   where: Prisma.LocationWhereInput
// ): Promise<number> => {
//   return prisma.location.count({
//     where,
//   });
// };

// export const daoLocationCreate = async (
//   data: Prisma.LocationCreateInput
// ): Promise<Location> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.location.findMany,
//     data.slug as Record<string, string>
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const location: Location = await prisma.location.create({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, locationFullTextKeys),
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     location,
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationGetById = async (id: number,
//   include?: Prisma.LocationInclude | undefined): Promise<Location> => {
//   const location: Location | null = await prisma.location.findUnique({
//     where: { id },
//     include
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       location,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationUpdate = async (
//   id: number,
//   data: Prisma.LocationUpdateInput
// ): Promise<Location> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.location.findMany,
//     data.slug as Record<string, string>,
//     id
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const term: Location = await prisma.location.update({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, locationFullTextKeys),
//     },
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationDelete = async (id: number): Promise<Location> => {
//   const term: Location = await prisma.location.delete({
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export const daoLocationGetBySlug = async (
//   slug: string,
//   include?: Prisma.LocationInclude | undefined
// ): Promise<Location> => {
//   const location = await prisma.location.findFirst({
//     where: {
//       OR: [
//         {
//           slug: {
//             path: ["en"],
//             equals: slug,
//           },
//         },
//         {
//           slug: {
//             path: ["de"],
//             equals: slug,
//           },
//         },
//       ],
//     },
//     include,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       location,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.location
//   );
// };

// export default {
//   daoLocationQuery,
//   daoLocationQueryFirst,
//   daoLocationQueryCount,
//   daoLocationGetById,
//   daoLocationCheckSlugUnique,
//   daoLocationCreate,
//   daoLocationUpdate,
//   daoLocationDelete,
//   daoLocationSearchQuery,
//   daoLocationGetBySlug,
// };
