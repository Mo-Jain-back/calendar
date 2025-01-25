import { CalendarEventType, useEventStore } from "@/lib/store";
import dayjs from "dayjs";
import React from "react";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  hour?: number;
};

export function EventRenderer({ date, view, events, hour }: EventRendererProps) {
  const { openEventSummary } = useEventStore();

  // Filter events based on the current view and hour
  const filteredEvents = events.filter((event: CalendarEventType) => {
    const eventHour = parseInt(event.startTime.split(":")[0]);
    if (view === "month") {
      return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.startDate.hour() === hour && !event.allDay;
    }
    return false;
  });

  // const filteredEvents = events.filter((event: CalendarEventType) => {
  //   const eventHour = parseInt(event.startTime.split(":")[0]);
  //   if (view === "month") {
  //     return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY");
  //   } else if (view === "week" || view === "day") {
  //     return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY") && eventHour === hour;
  //   }
  //   return false;
  // });

  const noOfEvents = filteredEvents.length;

  return (
    <div
      className={` w-full ${
        view === "month" ? "flex flex-col" : "flex"
      }`}
    >
      {view === "month" &&
        filteredEvents.slice(0, 4).map((event, index) => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
            className={`z-10 my-[1px] line-clamp-1 max-sm:h-[12px] w-full m-0 flex justify-start 
              items-center cursor-pointer rounded-sm bg-blue-700 p-[1px] text-[7px] 
              sm:text-xs text-white`}
          >
            {event.title}
          </div>
        ))}
      {view === "month" && noOfEvents > 4 && (
        <div
          className="z-10 line-clamp-1 max-sm:h-[8px] w-full m-0 flex justify-start 
            items-center cursor-pointer rounded-sm bg-gray-300 text-[7px] lg:text-xs lg:p-[2px]
             text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            // Add logic to open a modal or show more events for the day
          }}
        >
          {`+${noOfEvents - 4} more`}
        </div>
      )}
      {view !== "month" &&
        filteredEvents.map((event, index) => {
          // For week and day views, calculate height, width, and positioning
          const start = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.startTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const end = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.endTime}`,
            "YYYY-MM-DD HH:mm"
          );

          const durationInMinutes = end.diff(start, "minute");
          const heightFactor = 16 / 60; // 16px for 1 hour
          const dynamicHeight = durationInMinutes * heightFactor * 4; // 1 hour = 64px
          const startMinutes = start.hour() * 60 + start.minute(); // Total minutes since midnight

          // Calculate total available width and width per event
          const totalGap = (noOfEvents - 1) * 1; // Total gap space
          const availableWidth = 100 - totalGap; // Remaining width for events
          const eventWidth = `${availableWidth / noOfEvents}%`;
          const leftOffset = `calc(${index} * (${availableWidth / noOfEvents}% + 1px))`; // Adjust position for gaps

          const topOffset = (startMinutes / 60) * 64; // Calculate the top position in pixels

          return (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                openEventSummary(event);
              }}
              style={{
                height: `${dynamicHeight}px`,
                width: eventWidth,
                left: leftOffset,
                top: `${topOffset}px`,
              }}
              className={`absolute z-10 mx-[1px] line-clamp-1 max-sm:h-[12px] m-0 flex justify-start 
                items-center cursor-pointer rounded-sm bg-blue-700 p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {noOfEvents < 3 || view === "day" ? event.title : ""}
            </div>
          );
        })}
    </div>
  );
}
