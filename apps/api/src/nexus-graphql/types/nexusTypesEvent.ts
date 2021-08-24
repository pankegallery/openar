export default {};

// /// <reference path="../../types/nexus-typegen.ts" />
// import { parseResolveInfo } from "graphql-parse-resolve-info";
// import { filteredOutputByWhitelist } from "../../utils";

// import dedent from "dedent";
// import {
//   objectType,
//   extendType,
//   inputObjectType,
//   nonNull,
//   stringArg,
//   intArg,
//   arg,
//   list,
// } from "nexus";
// import httpStatus from "http-status";
// import { ApiError } from "../../utils";

// import { GQLJson } from "./nexusTypesShared";

// import { authorizeApiUser } from "../helpers";

// import { apiConfig } from "../../config";

// import {
//   daoEventQuery,
//   daoEventQueryCount,
//   daoEventQueryFirst,
//   daoEventCreate,
//   daoEventDelete,
//   daoUserGetById,
//   daoEventGetBySlug,
//   daoImageSaveImageTranslations,
// } from "../../dao";

// import { eventUpdate } from "../../services/serviceEvent";

// export const EventDate = objectType({
//   name: "EventDate",
//   definition(t) {
//     t.nonNull.int("id");
//     t.date("date");
//     t.date("begin");
//     t.date("end");

//     t.date("createdAt");
//     t.date("updatedAt");
//   },
// });

// export const Event = objectType({
//   name: "Event",
//   definition(t) {
//     t.nonNull.int("id");
//     t.json("title");
//     t.json("slug");

//     t.nonNull.int("ownerId");
//     t.nonNull.int("status");
//     t.field("author", {
//       type: "User",

//       // resolve(root, args, ctx, info)
//       async resolve(...[p]) {
//         if (p.ownerId) {
//           const user = await daoUserGetById(p.ownerId);
//           if (user)
//             return filteredOutputByWhitelist(user, [
//               "id",
//               "firstName",
//               "lastName",
//             ]);
//         }
//         return null;
//       },
//     });
//     t.json("description");
//     t.json("descriptionLocation");

//     t.list.field("dates", {
//       type: "EventDate",
//     });

//     t.list.field("terms", {
//       type: "Term",
//     });

//     t.list.field("locations", {
//       type: "Location",
//     });

//     t.field("heroImage", {
//       type: "Image",
//     });

//     t.date("createdAt");
//     t.date("updatedAt");
//   },
// });

// export const EventQueryResult = objectType({
//   name: "EventQueryResult",
//   description: dedent`
//     List all the events in the database.
//   `,
//   definition: (t) => {
//     t.int("totalCount");
//     t.field("events", {
//       type: list("Event"),
//     });
//   },
// });

// export const EventQueries = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("events", {
//       type: EventQueryResult,

//       args: {
//         pageIndex: intArg({
//           default: 0,
//         }),
//         pageSize: intArg({
//           default: apiConfig.db.defaultPageSize,
//         }),
//         orderBy: arg({
//           type: GQLJson,
//           default: undefined,
//         }),
//         where: arg({
//           type: GQLJson,
//           default: undefined,
//         }),
//       },

//       // TODO: enable! authorize: (...[, , ctx]) => authorizeApiUser(ctx, "eventRead"),

//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let totalCount;
//         let events;
//         let include = {};

//         if ((pRI?.fieldsByTypeName?.EventQueryResult as any)?.totalCount) {
//           totalCount = await daoEventQueryCount(args.where);

//           if (totalCount === 0)
//             return {
//               totalCount,
//               events: [],
//             };
//         }

//         if (
//           (pRI?.fieldsByTypeName?.EventQueryResult as any)?.events
//             ?.fieldsByTypeName?.Event?.terms
//         ) {
//           include = {
//             ...include,
//             terms: {
//               select: {
//                 id: true,
//                 name: true,
//                 slug: true,
//               },
//             },
//           };
//         }

//         if (
//           (pRI?.fieldsByTypeName?.EventQueryResult as any)?.events
//             ?.fieldsByTypeName?.Event?.dates
//         ) {
//           include = {
//             ...include,
//             dates: {
//               select: {
//                 id: true,
//                 date: true,
//                 begin: true,
//                 end: true,
//               },
//             },
//           };
//         }

//         if (
//           (pRI?.fieldsByTypeName?.EventQueryResult as any)?.events
//             ?.fieldsByTypeName?.Event?.locations
//         ) {
//           include = {
//             ...include,
//             locations: {
//               select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 lat: true,
//                 lng: true,
//               },
//             },
//           };
//         }

//         if ((pRI?.fieldsByTypeName?.EventQueryResult as any)?.events)
//           events = await daoEventQuery(
//             args.where,
//             Object.keys(include).length > 0 ? include : undefined,
//             args.orderBy,
//             args.pageIndex as number,
//             args.pageSize as number
//           );

//         return {
//           totalCount,
//           events,
//         };
//       },
//     });

//     t.nonNull.field("event", {
//       type: "Event",

//       args: {
//         slug: nonNull(stringArg()),
//       },

//       // resolve(root, args, ctx, info)
//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let include = {};

//         if ((pRI?.fieldsByTypeName?.Event as any)?.heroImage)
//           include = {
//             ...include,
//             heroImage: {
//               include: {
//                 translations: true,
//               },
//             },
//           };

//         return daoEventGetBySlug(args.slug, include);
//       },
//     });

//     t.nonNull.field("eventRead", {
//       type: "Event",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "eventRead"),

//       // resolve(root, args, ctx, info)
//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let include = {};

//         if ((pRI?.fieldsByTypeName?.Event as any)?.terms)
//           include = {
//             ...include,
//             terms: {
//               select: {
//                 id: true,
//                 name: true,
//                 slug: true,
//               },
//             },
//           };

//         if ((pRI?.fieldsByTypeName?.Event as any)?.dates)
//           include = {
//             ...include,
//             dates: {
//               select: {
//                 id: true,
//                 date: true,
//                 begin: true,
//                 end: true,
//               },
//               orderBy: {
//                 date: "asc",
//               },
//             },
//           };

//         if ((pRI?.fieldsByTypeName?.Event as any)?.locations)
//           include = {
//             ...include,
//             locations: {
//               select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 lat: true,
//                 lng: true,
//               },
//               orderBy: {
//                 title: "asc",
//               },
//             },
//           };

//         if ((pRI?.fieldsByTypeName?.Event as any)?.heroImage)
//           include = {
//             ...include,
//             heroImage: {
//               include: {
//                 translations: true,
//               },
//             },
//           };

//         return daoEventQueryFirst(
//           {
//             id: args.id,
//           },
//           Object.keys(include).length > 0 ? include : undefined
//         );
//       },
//     });
//   },
// });

// export const EventUpsertInput = inputObjectType({
//   name: "EventUpsertInput",
//   definition(t) {
//     t.nonNull.json("title");
//     t.nonNull.json("slug");
//     t.nonNull.int("status");
//     t.json("description");
//     t.json("descriptionLocation");
//     t.nonNull.json("owner");
//     t.json("terms");
//     t.json("dates");
//     t.json("locations");
//     t.json("heroImage");
//   },
// });

// export const EventMutations = extendType({
//   type: "Mutation",

//   definition(t) {
//     t.nonNull.field("eventCreate", {
//       type: "Event",

//       args: {
//         data: nonNull("EventUpsertInput"),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "eventCreate"),

//       async resolve(...[, args]) {
//         const event = await daoEventCreate(args.data);

//         if (!event)
//           throw new ApiError(
//             httpStatus.INTERNAL_SERVER_ERROR,
//             "Creation failed"
//           );

//         return event;
//       },
//     });

//     t.nonNull.field("eventUpdate", {
//       type: "Event",

//       args: {
//         id: nonNull(intArg()),
//         data: nonNull("EventUpsertInput"),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "eventUpdate"),

//       async resolve(...[, args]) {
//         const event = await eventUpdate(args.id, args.data);

//         if (!event)
//           throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");


//         return event;
//       },
//     });

//     t.nonNull.field("eventDelete", {
//       type: "BooleanResult",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "eventDelete"),

//       async resolve(...[, args]) {
//         const event = await daoEventDelete(args.id);

//         if (!event)
//           throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

//         return { result: true };
//       },
//     });
//   },
// });
