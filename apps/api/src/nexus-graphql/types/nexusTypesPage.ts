export default {}

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
//   daoPageQuery,
//   daoPageQueryCount,
//   daoPageGetById,
//   daoPageCreate,
//   daoPageUpdate,
//   daoPageDelete,
//   daoUserGetById,
//   daoPageGetBySlug,
//   daoImageSaveImageTranslations,
// } from "../../dao";

// export const Page = objectType({
//   name: "Page",
//   definition(t) {
//     t.nonNull.int("id");
//     t.json("title");
//     t.json("slug");
//     t.json("content");
//     t.string("fullText");
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
//     t.field("heroImage", {
//       type: "Image",
//     });
//     t.date("createdAt");
//     t.date("updatedAt");
//   },
// });

// export const PageQueryResult = objectType({
//   name: "PageQueryResult",
//   description: dedent`
//     List all the pages in the database.     
//   `,
//   definition: (t) => {
//     t.int("totalCount");
//     t.field("pages", {
//       type: list("Page"),
//     });
//   },
// });

// export const PageQueries = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("pages", {
//       type: PageQueryResult,

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

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "pageRead"),

//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let totalCount;
//         let pages;

//         if ((pRI?.fieldsByTypeName?.PageQueryResult as any)?.totalCount) {
//           totalCount = await daoPageQueryCount(args.where);

//           if (totalCount === 0)
//             return {
//               totalCount,
//               pages: [],
//             };
//         }

//         if ((pRI?.fieldsByTypeName?.PageQueryResult as any)?.pages)
//           pages = await daoPageQuery(
//             args.where,
//             args.orderBy,
//             args.pageIndex as number,
//             args.pageSize as number
//           );

//         return {
//           totalCount,
//           pages,
//         };
//       },
//     });

//     t.nonNull.field("pageRead", {
//       type: "Page",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "pageRead"),

//       // resolve(root, args, ctx, info)
//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let include = {};
//         if ((pRI?.fieldsByTypeName?.Page as any)?.heroImage)
//           include = {
//             ...include,
//             heroImage: {
//               include: {
//                 translations: true,
//               },
//             },
//           };

//         return daoPageGetById(
//           args.id,
//           Object.keys(include).length > 0 ? include : undefined
//         );
//       },
//     });

//     t.nonNull.field("page", {
//       type: "Page",

//       args: {
//         slug: nonNull(stringArg()),
//       },

//       // resolve(root, args, ctx, info)
//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let include = {};
//         if ((pRI?.fieldsByTypeName?.Page as any)?.heroImage)
//           include = {
//             ...include,
//             heroImage: {
//               include: {
//                 translations: true,
//               },
//             },
//           };

//         return daoPageGetBySlug(
//           args.slug,
//           Object.keys(include).length > 0 ? include : undefined
//         );
//       },
//     });
//   },
// });

// export const PageCreateInput = inputObjectType({
//   name: "PageUpsertInput",
//   definition(t) {
//     t.nonNull.json("title");
//     t.nonNull.json("slug");
//     t.json("heroImage");
//     t.nonNull.json("content");
//     t.nonNull.json("owner");
//     t.nonNull.int("status");
//   },
// });

// export const PageMutations = extendType({
//   type: "Mutation",

//   definition(t) {
//     t.nonNull.field("pageCreate", {
//       type: "Page",

//       args: {
//         data: nonNull("PageUpsertInput"),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "pageCreate"),

//       async resolve(...[, args]) {
//         const page = await daoPageCreate(args.data);

//         if (!page)
//           throw new ApiError(
//             httpStatus.INTERNAL_SERVER_ERROR,
//             "Creation failed"
//           );

//         return page;
//       },
//     });

//     t.nonNull.field("pageUpdate", {
//       type: "Page",

//       args: {
//         id: nonNull(intArg()),
//         data: nonNull("PageUpsertInput"),
//         imagesTranslations: list(arg({ type: "ImageTranslationInput" })),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "pageUpdate"),

//       async resolve(...[, args]) {
//         const page = await daoPageUpdate(args.id, args.data);

//         if (!page)
//           throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

//         if (Array.isArray(args.imagesTranslations))
//           await daoImageSaveImageTranslations(args.imagesTranslations);
        
//         return page;
//       }
//     });

//     t.nonNull.field("pageDelete", {
//       type: "BooleanResult",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "pageDelete"),

//       async resolve(...[, args]) {
//         const page = await daoPageDelete(args.id);

//         if (!page)
//           throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

//         return { result: true };
//       },
//     });
//   },
// });
