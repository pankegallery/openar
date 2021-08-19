export default {}

// import httpStatus from "http-status";
// import { Event, EventDate, Prisma } from "@prisma/client";
// import { filteredOutputByBlacklist } from "../utils";

// import { ApiError, filteredOutputByBlacklistOrNotFound } from "../utils";
// import { apiConfig } from "../config";
// import { getPrismaClient } from "../db/client";
// import {
//   daoSharedCheckSlugUnique,
//   daoSharedGenerateFullText,
//   daoSharedWrapImageWithTranslationImage,
//   daoImageTranslatedColumns,
// } from ".";

// const prisma = getPrismaClient();

// const eventFullTextKeys = [
//   "title",
//   "slug",
//   "description",
//   "descriptionLocation",
// ];

// export const daoEventCheckSlugUnique = async (
//   slug: Record<string, string>,
//   id?: number,
//   uniqueInObject?: boolean
// ): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
//   return daoSharedCheckSlugUnique(
//     prisma.event.findMany,
//     slug,
//     id,
//     uniqueInObject
//   );
// };

// export const daoEventQuery = async (
//   where: Prisma.EventWhereInput,
//   include: Prisma.EventInclude | undefined,
//   orderBy: Prisma.EventOrderByInput | Prisma.EventOrderByInput[],
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize
// ): Promise<Event[]> => {
//   const events: Event[] = await prisma.event.findMany({
//     where,
//     include,
//     orderBy,
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     events,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventSearchQuery = async (
//   where: Prisma.EventWhereInput,
//   pageIndex: number = 0,
//   pageSize: number = apiConfig.db.defaultPageSize * 3
// ): Promise<Event[]> => {
//   const events = await prisma.event.findMany({
//     where,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       dates: {
//         select: {
//           date: true,
//           begin: true,
//           end: true,
//         },
//       },
//       locations: {
//         select: {
//           id: true,
//           title: true,
//           slug: true,
//           lng: true,
//           lat: true,
//         },
//       },
//     },
//     skip: pageIndex * pageSize,
//     take: Math.min(pageSize, apiConfig.db.maxPageSize),
//   });

//   return filteredOutputByBlacklist(
//     events,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventQueryFirst = async (
//   where: Prisma.EventWhereInput,
//   include: Prisma.EventInclude | undefined
// ): Promise<Event> => {
//   const event = await prisma.event.findFirst({
//     where,
//     include,
//     take: 1000,
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       event,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventQueryCount = async (
//   where: Prisma.EventWhereInput
// ): Promise<number> => {
//   return prisma.event.count({
//     where,
//   });
// };

// export const daoEventCreate = async (
//   data: Prisma.EventCreateInput
// ): Promise<Event> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.event.findMany,
//     data.slug as Record<string, string>
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const event: Event = await prisma.event.create({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, eventFullTextKeys),
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     event,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventGetById = async (
//   id: number,
//   include?: Prisma.EventInclude | undefined
// ): Promise<Event> => {
//   const event: Event | null = await prisma.event.findUnique({
//     where: { id },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       event,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventUpdate = async (
//   id: number,
//   data: Prisma.EventUpdateInput
// ): Promise<Event> => {
//   const result = await daoSharedCheckSlugUnique(
//     prisma.event.findMany,
//     data.slug as Record<string, string>,
//     id
//   );

//   if (!result.ok)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       `Slug is not unique in [${Object.keys(result.errors).join(",")}]`
//     );

//   const term: Event = await prisma.event.update({
//     data: {
//       ...data,
//       fullText: daoSharedGenerateFullText(data, eventFullTextKeys),
//     },
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventDelete = async (id: number): Promise<Event> => {
//   await prisma.eventDate.deleteMany({
//     where: {
//       event: {
//         id,
//       },
//     },
//   });

//   const term: Event = await prisma.event.delete({
//     where: {
//       id,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     term,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventGetDatesById = async (
//   id: number
// ): Promise<EventDate[]> => {
//   const eventDates: EventDate[] = await prisma.eventDate.findMany({
//     where: {
//       event: {
//         id,
//       },
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     eventDates,
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export const daoEventDeleteDatesByIds = async (
//   dateId: number,
//   ids: number[]
// ): Promise<number> => {
//   const { count } = await prisma.eventDate.deleteMany({
//     where: {
//       event: {
//         id: dateId,
//       },
//       id: {
//         in: ids,
//       },
//     },
//   });

//   return count;
// };

// export const daoEventGetBySlug = async (
//   slug: string,
//   include?: Prisma.EventInclude | undefined
// ): Promise<Event> => {
//   const event = await prisma.event.findFirst({
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

//     include: {
//       ...include,
//       terms: {
//         select: {
//           id: true,
//           name: true,
//           slug: true,
//         },
//         orderBy: {
//           name: "asc",
//         },
//       },
//       dates: {
//         select: {
//           date: true,
//           begin: true,
//           end: true,
//         },
//         orderBy: {
//           date: "asc",
//         },
//       },

//       locations: {
//         select: {
//           id: true,
//           slug: true,
//           title: true,
//           lat: true,
//           lng: true,
//         },
//         orderBy: {
//           title: "asc",
//         },
//       },
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     daoSharedWrapImageWithTranslationImage(
//       "heroImage",
//       event,
//       daoImageTranslatedColumns
//     ),
//     apiConfig.db.privateJSONDataKeys.event
//   );
// };

// export default {
//   daoEventQuery,
//   daoEventQueryFirst,
//   daoEventQueryCount,
//   daoEventGetById,
//   daoEventGetBySlug,
//   daoEventCheckSlugUnique,
//   daoEventCreate,
//   daoEventUpdate,
//   daoEventDelete,
//   daoEventSearchQuery,
//   daoEventGetDatesById,
// };

