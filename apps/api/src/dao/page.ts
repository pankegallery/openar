export default {};

// import httpStatus from "http-status";
// import { Page, Prisma } from "@prisma/client";

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

// export const daoPageTranlatedColumns = ["title", "slug", "content"];

// export const daoPageCheckSlugUnique = async (
//   slug: Record<string, string>,
//   id?: number,
//   uniqueInObject?: boolean
// ): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
//   return daoSharedCheckSlugUnique(
//     prisma.page.findMany,
//     slug,
//     id,
//     uniqueInObject
//   );
// };

// export const daoPageQuery = async (
//   where: Prisma.PageWhereInput,
//   orderBy: Prisma.PageOrderByInput | Prisma.PageOrderByInput[],
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize
// ): Promise<Page[]> => {
//   const pages: Page[] = await prisma.page.findMany({
//     where,
//     orderBy,
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     pages,
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageQueryCount = async (
//   where: Prisma.PageWhereInput
// ): Promise<number> => {
//   return prisma.page.count({
//     where,
//   });
// };

// export const daoPageCreate = async (
//   data: Prisma.PageCreateInput
// ): Promise<Page> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.page.findMany,
//     data.slug as Record<string, string>
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const page: Page = await prisma.page.create({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, ["title", "slug", "content"]),
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     page,
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageGetById = async (
//   id: number,
//   include?: Prisma.PageInclude | undefined
// ): Promise<Page> => {
//   const page: Page | null = await prisma.page.findUnique({
//     where: { id },
//     include,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       page,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageSearchQuery = async (
//   where: Prisma.PageWhereInput,
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize * 3
// ): Promise<Page[]> => {
//   const pages = await prisma.page.findMany({
//     where,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//     },
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     pages,
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageGetBySlug = async (
//   slug: string,
//   include?: Prisma.PageInclude | undefined
// ): Promise<Page> => {
//   const page: Page | null = await prisma.page.findFirst({
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
//       page,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageUpdate = async (
//   id: number,
//   data: Prisma.PageUpdateInput
// ): Promise<Page> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.page.findMany,
//     data.slug as Record<string, string>,
//     id
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const page: Page = await prisma.page.update({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, ["title", "slug", "content"]),
//     },
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       page,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export const daoPageDelete = async (id: number): Promise<Page> => {
//   const page: Page = await prisma.page.delete({
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     page,
//     apiConfig.db.privateJSONDataKeys.page
//   );
// };

// export default {
//   daoPageQuery,
//   daoPageQueryCount,
//   daoPageGetById,
//   daoPageCheckSlugUnique,
//   daoPageCreate,
//   daoPageUpdate,
//   daoPageDelete,
//   daoPageGetBySlug,
// };
