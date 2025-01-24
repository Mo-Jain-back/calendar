import { CalendarEventType, useEventStore } from "@/lib/store";

import dayjs from "dayjs";
import React from "react";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  hour:number;
};

export function EventRenderer({ date, view, events,hour }: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const filteredEvents = events.filter((event: CalendarEventType) => {
    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if ( view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

  const noOfEvents = filteredEvents.length;

  return (
    <>
    <div className={`w-full ${view!="month"?"flex":""}`}>
      {filteredEvents.map((event) => {
        // Calculate the height dynamically based on the time difference
        const start = dayjs(`${dayjs(event.date).format('YYYY-MM-DD')} ${event.startTime}`, 'YYYY-MM-DD HH:mm');
        const end = dayjs(`${dayjs(event.date).format('YYYY-MM-DD')} ${event.endTime}`, 'YYYY-MM-DD HH:mm');
        const Zero = dayjs(`${dayjs(event.date).format('YYYY-MM-DD')} 00:00`, 'YYYY-MM-DD HH:mm');

        const durationInMinutes = end.diff(start, 'minute'); // Get the difference in minutes
        const heightFactor = 16 / 60; // Assuming `h-16` corresponds to 1 hour (60 minutes)
        const dynamicHeight = durationInMinutes * heightFactor*4;
        const durationFromZero = start.diff(Zero, 'minute'); // Get the difference in minutes
        const dynamicTop = durationFromZero * heightFactor*4;
        let timeString = event.startTime;
        let startHours = parseInt(timeString.split(":")[0], 10);
        if (view === "month") {
          return (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                openEventSummary(event);
              }}
              className={` z-10 mx-[1px]  line-clamp-1 max-sm:h-[12px]  w-full m-0 flex justify-start  
                items-center cursor-pointer rounded-sm bg-green-700 p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {event.title}
            </div>
          );
        } else if(startHours === hour){
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                openEventSummary(event);
              }}
              style={{ height: `${dynamicHeight}px` }} // Set the height dynamically
              className={`my-[1px]z-10 mx-[1px]  line-clamp-1 max-sm:h-[12px]  w-full m-0 flex justify-start  
                items-center cursor-pointer rounded-sm bg-green-700 p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {noOfEvents<3 ?event.title:""}
            </div>
          }
          else{
            return <></>;
          }
        })}
      </div>
    </>
  );
}
