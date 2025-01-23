import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { CalendarEventType } from "@/lib/store";
import dayjs from "dayjs";
import { eventsData } from "./datasource";

// const getEventsData = async () => {
//   try {
//     const data = await db.query.eventsTable.findMany();

//     // Convert the Dayjs object to a simple ISO string
//     return data.map((event) => ({
//       ...event,
//       date: dayjs(event.date).toISOString(), // Convert Dayjs to string
//     }));
//   } catch (error) {
//     console.error("Error fetching data from the database:", error);
//     return [];
//   }
// };

export default async function Home() {
  const dbEvents = eventsData;

  return (
    <div className="">
      <Header />
      <MainView eventsData={dbEvents as unknown as CalendarEventType[]} />
    </div>
  );
}
