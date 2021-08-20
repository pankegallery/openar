export default {};

// import { Event, Prisma } from "@prisma/client";
// import { daoEventGetDatesById, daoEventUpdate } from "../dao";

// export const eventUpdate = async (id: number, data: any): Promise<Event> => {
//   const currentEventDates = await daoEventGetDatesById(id);

//   // TODO: ANY!
//   const updateArgs: Prisma.EventUpdateInput = {
//     dates: {
//       update: [],
//       create: [],
//       deleteMany: [],
//     },
//   };

//   if (currentEventDates)
//     // first compile the id list of the event dates that have been removed
//     updateArgs.dates = currentEventDates.reduce((acc, date) => {
//       if (!acc) return acc;

//       if (
//         Array.isArray(data.dates) &&
//         data.dates.find((d: any) => d.id === date.id)
//       )
//         return acc;
//       if (acc.deleteMany)
//         (acc.deleteMany as any[]).push({
//           id: date.id,
//         });
//       return acc;
//     }, updateArgs.dates);

//   if (data.dates)
//     // now fill updates and deletes
//     updateArgs.dates = data.dates.reduce((acc: any, date: any) => {
//       if (!acc) return acc;

//       const dateInDb = currentEventDates.find((d: any) => d.id === date.id);
//       if (dateInDb) {
//         // found let's update if needed
//         if (
//           dateInDb.date !== date.date ||
//           dateInDb.begin ||
//           dateInDb.end !== date.end
//         )
//           // something has changed update the entry
//           acc.update.push({
//             data: {
//               date: date.date,
//               begin: date.begin,
//               end: date.end,
//             },
//             where: {
//               id: date.id,
//             },
//           });
//       } else if (acc.create) {
//         // create new event date
//         acc.create.push({
//           date: date.date,
//           begin: date.begin,
//           end: date.end,
//         });
//       }
//       return acc;
//     }, updateArgs.dates);

//   const event: Event = await daoEventUpdate(id, {
//     ...data,
//     ...updateArgs,
//   });

//   return event;
// };
// export default {
//   eventUpdate,
// };
