import { getHours, getWeekDays } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";
import {CalendarEventType} from "@/lib/store";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { openEventSummary } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const [isEventHidden, setIsEventHidden] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getFormatedEvents = (events:CalendarEventType[], date:Dayjs) => {
    const filteredEvents = events.filter((event: CalendarEventType) => {
        return event.startDate.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
      });

    return filteredEvents;
  }

  const getAllDayEvents = (events:CalendarEventType[], date:Dayjs) => {
    const filteredEvents = events.filter((event: CalendarEventType) => {
        return event.startDate.format("DD-MM-YY HH") === date.format("DD-MM-YY HH") && event.allDay;
      });

    return filteredEvents;
  }

  return (
    <>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-300 px-4 py-2">
        <div className="w-16 border-r border-gray-400 flex flex-col items-center justify-between">
          <div className="relative h-[64px]">
            <div className="absolute top-2 text-xs text-gray-600">GMT +2</div>
          </div>
          <div>
          {isEventHidden ?
          <ChevronDown className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(false)}/>
          :
          <ChevronUp className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(true)}/>
          }
          </div>
        </div>

        {/* Week View Header */}

        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) =>{
          const filteredEvents = getAllDayEvents(events,currentDate);
          const noOfEvents = filteredEvents.length;
          return(
          <div key={index} className="flex flex-col items-center justify-start w-full">
            <div className={cn("text-xs mt-6 sm:mt-8", today && "text-blue-600")}>
              {currentDate.format("ddd")}
            </div>
            <div
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 text-center flex items-center rounded-full p-2 text-sm sm:text-lg",
                today && "bg-blue-600 text-white",
              )}
            >
              {currentDate.format("DD")}{" "}
            </div>
            <div className="flex flex-col w-full transition-all duration-500 ease-in-out" style={{maxHeight: isEventHidden ? "40px sm:60px" : ""}}>
              {noOfEvents < 4 || !isEventHidden ? 
              <>
              {
                filteredEvents.length > 0 && filteredEvents.map((event, index) => (
         
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
              </>
              :
              <>
                {
                  filteredEvents.slice(0, 2).map((event, index) => (
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
                <div className="text-xs sm:text-sm px-2">+{noOfEvents-2}</div>
              </>
            }
            </div>
          </div>
        )})}
        
      </div>

      {/* Time Column & Corresponding Boxes of time per each date  */}

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2">
          {/* Time Column */}
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Corresponding Boxes */}

          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf("week")
                .add(index, "day");
                return (
                  <div key={index} className="relative border-1 border-black border-r border-gray-300">
                  {getHours.map((hour, i) => {
                    const filteredEvents = getFormatedEvents(events,dayDate.hour(hour.hour()));
                    return(
                    <div
                      key={i}
                      style={{ overflow: 'visible' }} // Add this style
                      className="relative flex h-[64px]  cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(dayDate.hour(hour.hour()));
                        openPopover();
                      }}
                    > 
                      <EventRenderer
                        events={filteredEvents}
                        date={dayDate}
                        hour={hour.hour()}
                        view="week"
                      />
                    </div>
                  )})}
                  {/* Current time indicator */}

                  {isCurrentDay(dayDate) && today && (
                    <div
                      className={cn("absolute h-0.5 w-full bg-red-500")}
                      style={{
                        top: `${(currentTime.hour() / 24) * 100}%`,
                      }}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </>
  );
}
