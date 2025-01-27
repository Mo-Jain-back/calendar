"use client";
import { CalendarEventType, useEventRows, useEventStore } from "@/lib/store";
import dayjs, { Dayjs } from "dayjs";
import React, { use, useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';

interface EventRendererProps  {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  hour?: number;
  eventsRow?: { id: string; rowIndex: number }[];
  setEventsRow?: React.Dispatch<React.SetStateAction<{ id: string; rowIndex: number }[]>>;
};

export function EventRenderer({ date, view, events, hour,eventsRow,setEventsRow}: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const [startRow, setStartRow] = useState<number>(0);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });

  useEffect(() => {
    findStartRow();
  }, [date,events]);

 

  const findStartRow = () => {
    const currentDate = date.startOf("day");
    let maxRowIndex = 0;
    let isMultiDayEvent = false;
    const extendedEvents = events.filter((event) => {
      const eventStart = dayjs(event.startDate).startOf("day");
      const eventEnd = dayjs(event.endDate).startOf("day");
      return (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate) )
      || eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate);
    });
    
    if(extendedEvents.length > 0){
      isMultiDayEvent = true;
    }
    // Find the maximum row index from extended events
    maxRowIndex = extendedEvents.reduce((max, event) => {
      const row = eventsRow?.find((row) => row.id === event.id);
      return row ? Math.max(max, row.rowIndex) : max;
    }, 0);

    maxRowIndex = isMultiDayEvent ? maxRowIndex+1 : 0;
    setStartRow(maxRowIndex);
     
    let index = maxRowIndex;

    const newEventsRow = eventsRow || [];
    
    events.forEach((event) => {
      if (event.startDate.isSame(date, "day") && event.endDate.isAfter(date, "day")) {
        newEventsRow.push({ id: event.id, rowIndex: index });
        index++;
      }
    });

    //below line is not updating the state
    // eventsRow = newEventsRow;
    setEventsRow && setEventsRow(newEventsRow);
    setStartRow(maxRowIndex);
    
  };

  const filteredEvents = events.filter((event: CalendarEventType) => {
    const eventHour = parseInt(event.startTime.split(":")[0]);
    if (view === "month") {
      return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY")
      // && event.startDate.format("DD-MM-YY") === event.endDate.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.startDate.hour() === hour && !event.allDay;
    }
    return false;
  });
  
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
    const durationB = b.endDate.diff(b.startDate, "minute");
    return durationB - durationA; // Sort in descending order (longest first)
  });

 
  
  const noOfMutliDayEvents = ()=>{
    const temp = events.filter((e: CalendarEventType) => {
      return e.startDate.isBefore(date, "day") && e.endDate.isAfter(date, "day")
      || e.startDate.isBefore(date, "day") && e.endDate.isSame(date, "day")
    });
    return temp.length;
  }
  const singleDayEvents = events.filter((event) => 
    event.startDate.format("DD-MM-YY") === event.endDate.format("DD-MM-YY")
  );

  const multiDayEvents = events.filter((event) => {
    return event.startDate.isBefore(date.endOf("day")) && event.endDate.isAfter(date.startOf("day"))
    || event.startDate.isBefore(date.endOf("day")) && event.endDate.isSame(date.startOf("day"))
  });
  
  // Sort events to position them correctly
  multiDayEvents.sort((a, b) => a.startDate.diff(b.startDate));
  

  const occupiedRows: Record<string, number[]> = {};
   
  const noOfEvents = sortedEvents.length;

  return (
    <div
      className={` w-full ${
        view === "month" ? "flex flex-col" : "flex"
      }`}
    >
      {view === "month" &&
        <>
        {startRow+noOfEvents<=5 ?
          <> 
            {sortedEvents.map((event, index) => {
              //find difference in number of days between start and end date
              const weekEnd = event.startDate.endOf("week");
              const diffFromWeekEnd = weekEnd.diff(event.startDate, "days")+1;
              const diffInDays = event.endDate.diff(event.startDate, "days")+1;
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width: `calc(${100*Math.min(diffInDays,diffFromWeekEnd)}% + ${Math.min(diffInDays,diffFromWeekEnd)*2}px)`,
                  marginTop: `${index === 0 ? (isSmallScreen ? startRow * 12 : startRow * 18) + startRow : 0}px`,
                }}
                className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px] mt-[${index==0?startRow*18+startRow:0}px] flex justify-start 
                  items-center cursor-pointer rounded-sm bg-[#039BE5] font-semibold p-[1px] text-[7px] 
                  sm:text-xs text-white`}
              >
                {event.title} 
              </div>
            )})}
          </>
          :
          <>
            {sortedEvents.slice(0, 4-startRow).map((event, index) => {
              //find difference in number of days between start and end date
              const weekEnd = event.startDate.endOf("week");
              const diffFromWeekEnd = weekEnd.diff(event.startDate, "days")+1;
              const diffInDays = event.endDate.diff(event.startDate, "days")+1;
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width: `calc(${100*Math.min(diffInDays,diffFromWeekEnd)}% + ${Math.min(diffInDays,diffFromWeekEnd)*2}px)`,
                  marginTop: `${index === 0 ? (isSmallScreen ? startRow * 12 : startRow * 18) + startRow : 0}px`,
                }}
                className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px] mt-[${index==0?startRow*18+startRow:0}px] flex justify-start 
                  items-center cursor-pointer rounded-sm bg-[#039BE5] font-semibold p-[1px] text-[7px] 
                  sm:text-xs text-white`}
              >
                {event.title}
              </div>
            )})}
          </>
        }
      { startRow+noOfEvents > 5 && (
        <div
          className="z-10 line-clamp-1 h-[18px] max-sm:h-[12px] w-full m-0 flex justify-start 
            items-center cursor-pointer rounded-sm hover:bg-gray-300 text-[7px] font-semibold sm:text-xs p-[2px]
             text-gray-700 px-1"
          onClick={(e) => {
            e.stopPropagation();
            // Add logic to open a modal or show more events for the day
          }}
        >
          {`${startRow+noOfEvents - 4} more`}
        </div>
      )}
      </>
        }
      {view !== "month" &&
        sortedEvents.map((event, index) => {
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
                items-center cursor-pointer rounded-sm bg-[#039BE5] font-bold p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {noOfEvents < 3 || view === "day" ? event.title : ""}
            </div>
          );
        })}
    </div>
  );
}
