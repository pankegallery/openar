export default {};

// import httpStatus from "http-status";
// import { Term, Prisma } from "@prisma/client";

// import { ApiError, filteredOutputByBlacklistOrNotFound, filteredOutputByBlacklist } from "../utils";
// import { apiConfig } from "../config";
// import { getPrismaClient } from "../db/client";
// import { daoSharedCheckSlugUnique } from "./shared";

// const prisma = getPrismaClient();

// export const daoTermCheckSlugUnique = async (
//   slug: Record<string, string>,
//   id?: number,
//   uniqueInObject?: boolean
// ): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
//   return daoSharedCheckSlugUnique(
//     prisma.term.findMany,
//     slug,
//     id,
//     uniqueInObject
//   );
// };

// export const daoTermQuery = async (
//   taxonomyId: number,
//   where: Prisma.TermWhereInput,
//   orderBy: any,
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize
// ): Promise<Term[]> => {
//   const terms: Term[] = await prisma.term.findMany({
//     where: {
//       ...where,
//       taxonomyId,
//     },
//     orderBy,
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(terms, apiConfig.db.privateJSONDataKeys.term);
// };

// export const daoTermQueryCount = async (
//   taxonomyId: number,
//   where: Prisma.TermWhereInput
// ): Promise<number> => {
//   return prisma.term.count({
//     where: {
//       ...where,
//       taxonomyId,
//     },
//   });
// };

// export const daoTermGetTermsByTaxonomyId = async (
//   taxonomyId: number
// ): Promise<Term[]> => {
//   const terms: Term[] = await prisma.term.findMany({
//     where: {
//       taxonomyId,
//     },
//   });

//   return filteredOutputByBlacklist(terms, apiConfig.db.privateJSONDataKeys.term);
// };

// export const daoTermGetTermsCountByTaxonomyId = async (
//   taxonomyId: number
// ): Promise<number> => {
//   const count = await prisma.term.count({
//     where: {
//       taxonomyId,
//     },
//   });

//   return count;
// };

// export const daoTermGetById = async (id: number): Promise<Term> => {
//   const term: Term | null = await prisma.term.findUnique({
//     where: { id },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.term
//   );
// };

// export const daoTermCreate = async (
//   data: Prisma.TermCreateInput
// ): Promise<Term> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.term.findMany,
//     data.slug as Record<string, string>
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const term: Term = await prisma.term.create({
//     data,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.term
//   );
// };

// export const daoTermUpdate = async (
//   id: number,
//   data: Prisma.TermUpdateInput
// ): Promise<Term> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.term.findMany,
//     data.slug as Record<string, string>,
//     id
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const term: Term = await prisma.term.update({
//     data,
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.term
//   );
// };

// export const daoTermDelete = async (id: number): Promise<Term> => {
//   const term: Term = await prisma.term.delete({
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.term
//   );
// };

// export default {
//   daoTermQuery,
//   daoTermQueryCount,
//   daoTermGetById,
//   daoTermGetTermsByTaxonomyId,
//   daoTermGetTermsCountByTaxonomyId,
//   daoTermCheckSlugUnique,
//   daoTermCreate,
//   daoTermUpdate,
//   daoTermDelete,
// };
