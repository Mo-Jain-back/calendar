import { CalendarEventType, useEventStore, useViewStore } from "@/lib/store";

import dayjs from "dayjs";
import React from "react";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const { selectedView } = useViewStore();
  const filteredEvents = events.filter((event: CalendarEventType) => {
    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

  return (
    <>
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            openEventSummary(event);
          }}
          className="line-clamp-1 w-full m-0 h-[10px] sm:h-6 flex justify-start items-center cursor-pointer rounded-sm bg-green-700 px-[1px] pb-[1px] text-[8px] sm:text-sm text-white"
        >
          {event.title}
        </div>
      ))}
    </>
  );
}
