import { CalendarEventType, useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { EventRenderer } from "./event-renderer";


export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getFormatedEvents = (events:CalendarEventType[], date:Dayjs) => {
    const filteredEvents = events.filter((event: CalendarEventType) => {
        return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
      });

    return filteredEvents;
  }
  const { openEventSummary } = useEventStore();

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <>
      <div className="grid grid-cols-[auto_auto_1fr] px-4">
        <div className="w-16 border-r border-gray-300 text-xs">GMT +2</div>
        <div className="flex w-16 flex-col items-center">
          <div className={cn("text-xs", isToday && "text-blue-600")}>
            {userSelectedDate.format("ddd")}{" "}
          </div>{" "}
          <div
            className={cn(
              "h-12 w-12 rounded-full p-2 text-2xl",
              isToday && "bg-blue-600 text-white",
            )}
          >
            {userSelectedDate.format("DD")}{" "}
          </div>
          <div className="flex flex-col w-full">
              {
                getFormatedEvents(events,userSelectedDate).length > 0 && getFormatedEvents(events,userSelectedDate).map((event, index) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventSummary(event);
                    }}
                    className={` my-[1px] max-sm:h-[12px] w-full flex justify-center items-center cursor-pointer rounded-sm bg-blue-700 text-[7px] 
                        sm:text-xs text-white`}
                        >
                    {event.title}
                  </div>
                ))
              }
            </div>
        </div>
        <div></div>
      </div>

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr] p-4">
          {/* Time Column */}
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-[64px]">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Day/Boxes Column */}
          <div className="relative border-r border-gray-300">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="relative flex h-[64px] cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  setDate(userSelectedDate.hour(hour.hour()));
                  openPopover();
                }}
              >
                <EventRenderer
                  events={getFormatedEvents(events,userSelectedDate.hour(hour.hour()))}
                  date={userSelectedDate.hour(hour.hour())}
                  view="day"
                  hour={hour.hour()}
                />
              </div>
            ))}

            {/* Current time indicator */}
            {isCurrentDay(userSelectedDate) && (
              <div
                className={cn("absolute h-0.5 w-full bg-red-500")}
                style={{
                  top: `${(currentTime.hour() / 24) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
