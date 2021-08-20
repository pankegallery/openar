export default {};

// import { Setting, Prisma } from "@prisma/client";

// import { filteredOutputByBlacklistOrNotFound, filteredOutputByBlacklist } from "../utils";
// import { apiConfig } from "../config";
// import { getPrismaClient } from "../db/client";

// const prisma = getPrismaClient();

// export type SettingUpdateData = {
//   key: string;
//   value: any;
// };

// export const daoSettingQuery = async (): Promise<Setting[]> => {
//   const settings: Setting[] = await prisma.setting.findMany({
//     orderBy: {
//       key: "asc",
//     },
//   });
//   return filteredOutputByBlacklist(settings, apiConfig.db.privateJSONDataKeys.all);
// };

// export const daoSettingGetById = async (id: number): Promise<Setting> => {
//   const setting: Setting | null = await prisma.setting.findUnique({
//     where: { id },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     setting,
//     apiConfig.db.privateJSONDataKeys.all
//   );
// };

// export const daoSettingUpsert = async (
//   key: string,
//   createData: Prisma.SettingCreateInput,
//   updateData: Prisma.SettingUpdateInput
// ): Promise<Setting> => {
//   const setting: Setting = await prisma.setting.upsert({
//     create: createData,
//     update: updateData,
//     where: {
//       key,
//     },
//   });

//   return filteredOutputByBlacklistOrNotFound(
//     setting,
//     apiConfig.db.privateJSONDataKeys.all
//   );
// };

// export default {
//   daoSettingQuery,
//   daoSettingGetById,
//   daoSettingUpsert,
// };
