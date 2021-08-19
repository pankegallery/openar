export default {}

// /// <reference path="../../types/nexus-typegen.ts" />
// import { parseResolveInfo } from "graphql-parse-resolve-info";

// import dedent from "dedent";
// import {
//   objectType,
//   extendType,
//   inputObjectType,
//   nonNull,
//   // stringArg,
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
//   daoTermQuery,
//   daoTermCreate,
//   daoTermUpdate,
//   daoTermDelete,
//   daoTermQueryCount,
//   daoTermGetById,
// } from "../../dao";

// export const Term = objectType({
//   name: "Term",
//   definition(t) {
//     t.nonNull.int("id");
//     t.nonNull.int("taxonomyId");
//     t.json("name");
//     t.json("slug");
//     t.date("createdAt");
//     t.date("updatedAt");
//     t.field("taxonomy", {
//       type: "Taxonomy",

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "taxRead"),

//       async resolve(...[parent]) {
//         return daoTermGetById(parent.taxonomyId);
//       },
//     });
//   },
// });

// export const TermQueryResult = objectType({
//   name: "TermQueryResult",

//   description: dedent`
//     List all the available terms of the given taxonomy in the database.     
//   `,

//   definition: (t) => {
//     t.int("totalCount");
//     t.field("terms", { type: list(Term) });
//   },
// });

// export const TermQueries = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("terms", {
//       type: "TermQueryResult",

//       args: {
//         taxonomyId: nonNull(intArg()),
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

//       async resolve(...[, args, , info]) {
//         const pRI = parseResolveInfo(info);

//         let totalCount;
//         let terms;

//         if ((pRI?.fieldsByTypeName?.TermQueryResult as any)?.totalCount) {
//           totalCount = await daoTermQueryCount(args.taxonomyId, args.where);

//           if (totalCount === 0)
//             return {
//               totalCount,
//               terms: [],
//             };
//         }

//         if ((pRI?.fieldsByTypeName?.TermQueryResult as any)?.terms)
//           terms = await daoTermQuery(
//             args.taxonomyId,
//             args.where,
//             args.orderBy,
//             args.pageIndex as number,
//             args.pageSize as number
//           );

//         return {
//           totalCount,
//           terms,
//         };
//       },
//     });

//     t.nonNull.field("termRead", {
//       type: "Term",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "taxRead"),

//       // resolve(root, args, ctx, info)
//       async resolve(...[, args]) {
//         return daoTermGetById(args.id);
//       },
//     });
//   },
// });

// export const TermCreateInput = inputObjectType({
//   name: "TermCreateInput",
//   definition(t) {
//     t.nonNull.json("name");
//     t.nonNull.json("slug");
//     t.nonNull.int("taxonomyId");
//   },
// });

// export const TermUpdateInput = inputObjectType({
//   name: "TermUpdateInput",
//   definition(t) {
//     t.nonNull.json("name");
//     t.nonNull.json("slug");
//   },
// });

// export const TermMutations = extendType({
//   type: "Mutation",

//   definition(t) {
//     t.nonNull.field("termCreate", {
//       type: "Term",

//       args: {
//         data: nonNull("TermCreateInput"),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "taxCreate"),

//       async resolve(...[, args]) {
//         const term = await daoTermCreate({
//           name: args.data.name,
//           slug: args.data.slug,
//           taxonomy: {
//             connect: { id: args.data.taxonomyId },
//           },
//         });

//         if (!term)
//           throw new ApiError(
//             httpStatus.INTERNAL_SERVER_ERROR,
//             "Creation failed"
//           );

//         return term;
//       },
//     });

//     t.nonNull.field("termUpdate", {
//       type: "Term",

//       args: {
//         id: nonNull(intArg()),
//         data: nonNull("TermUpdateInput"),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "taxUpdate"),

//       async resolve(...[, args]) {
//         const term = await daoTermUpdate(args.id, args.data);

//         if (!term)
//           throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

//         return term;
//       },
//     });

//     t.nonNull.field("termDelete", {
//       type: "BooleanResult",

//       args: {
//         id: nonNull(intArg()),
//       },

//       authorize: (...[, , ctx]) => authorizeApiUser(ctx, "taxDelete"),

//       async resolve(...[, args]) {
//         const term = await daoTermDelete(args.id);

//         if (!term)
//           throw new ApiError(
//             httpStatus.INTERNAL_SERVER_ERROR,
//             "Term deletion failed"
//           );

//         return { result: true };
//       },
//     });
//   },
// });
