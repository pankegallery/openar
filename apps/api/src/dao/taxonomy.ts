export default {}

// import httpStatus from "http-status";
// import { Taxonomy, Term, Prisma } from "@prisma/client";

// import { ApiError, filteredOutputByBlacklistOrNotFound, filteredOutputByBlacklist } from "../utils";
// import { apiConfig } from "../config";
// import { getPrismaClient } from "../db/client";
// import {
//   daoTermGetTermsByTaxonomyId,
//   daoTermGetTermsCountByTaxonomyId,
// } from "./term";
// import { daoSharedCheckSlugUnique } from "./shared";

// const prisma = getPrismaClient();

// export const daoTaxonomyCheckSlugUnique = async (
//   slug: Record<string, string>,
//   id?: number,
//   uniqueInObject?: boolean
// ): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
//   return daoSharedCheckSlugUnique(
//     prisma.taxonomy.findMany,
//     slug,
//     id,
//     uniqueInObject
//   );
// };

// export const daoTaxonomyQuery = async (
//   where: Prisma.TaxonomyWhereInput,
//   include: Prisma.TaxonomyInclude | undefined,
//   orderBy: Prisma.TaxonomyOrderByInput | Prisma.TaxonomyOrderByInput[],
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize
// ): Promise<Taxonomy[]> => {
//   const taxonomies: Taxonomy[] = await prisma.taxonomy.findMany({
//     where,
//     include,
//     orderBy,
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     taxonomies,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export const daoTaxonomyQueryFirst = async (
//   where: Prisma.TaxonomyWhereInput,
//   include?: Prisma.TaxonomyInclude | undefined,
//   orderBy?: Prisma.TaxonomyOrderByInput | Prisma.TaxonomyOrderByInput[],
//   pageIndex?: number,
//   pageSize?: number
// ): Promise<Taxonomy> => {
//   const taxonomy = await prisma.taxonomy.findFirst({
//     where,
//     include,
//     orderBy,
//     skip: (pageIndex ?? 0) * (pageSize ?? apiConfig.db.defaultPageSize),
//     take: Math.min(
//       pageSize ?? apiConfig.db.defaultPageSize,
//       apiConfig.db.maxPageSize
//     ),
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     taxonomy,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export const daoTaxonomyQueryCount = async (
//   where: Prisma.TaxonomyWhereInput
// ): Promise<number> => {
//   return prisma.taxonomy.count({
//     where,
//   });
// };

// export const daoTaxonomyGetTerms = async (id: number): Promise<Term[]> => {
//   return daoTermGetTermsByTaxonomyId(id);
// };

// export const daoTaxonomyGetById = async (id: number): Promise<Taxonomy> => {
//   const taxonomy: Taxonomy | null = await prisma.taxonomy.findUnique({
//     where: { id },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     taxonomy,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export const daoTaxonomyCreate = async (
//   data: Prisma.TaxonomyCreateInput
// ): Promise<Taxonomy> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.taxonomy.findMany,
//     data.slug as Record<string, string>
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const taxonomy: Taxonomy = await prisma.taxonomy.create({
//     data,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     taxonomy,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export const daoTaxonomyUpdate = async (
//   id: number,
//   data: Prisma.TaxonomyUpdateInput
// ): Promise<Taxonomy> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.taxonomy.findMany,
//     data.slug as Record<string, string>,
//     id
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const taxonomy: Taxonomy = await prisma.taxonomy.update({
//     data,
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     taxonomy,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export const daoTaxonomyDelete = async (id: number): Promise<Taxonomy> => {
//   const termCount = await daoTermGetTermsCountByTaxonomyId(id);
//   if (termCount > 0)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `You cannot delete the taxonomy as it still has ${termCount} terms`
//     );

//   const taxonomy: Taxonomy = await prisma.taxonomy.delete({
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     taxonomy,
//     apiConfig.db.privateJSONDataKeys.taxonomy
//   );
// };

// export default {
//   daoTaxonomyQuery,
//   daoTaxonomyQueryFirst,
//   daoTaxonomyQueryCount,
//   daoTaxonomyGetById,
//   daoTaxonomyCheckSlugUnique,
//   daoTaxonomyCreate,
//   daoTaxonomyUpdate,
//   daoTaxonomyDelete,
// };
