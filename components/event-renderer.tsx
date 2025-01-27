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
  wrappedEvents?: { id:string; date:Dayjs; endDate:Dayjs; rowIndex:number;}[];
  setWrappedEvents?: React.Dispatch<React.SetStateAction<{ id:string; date:Dayjs; endDate:Dayjs; rowIndex:number;}[]>>;
};

export function EventRenderer({ date, view, events, hour,eventsRow,setEventsRow,wrappedEvents,setWrappedEvents}: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const [startRow, setStartRow] = useState<number>(0);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  console.log("date",date.date());

  useEffect(() => {
    findStartRow();
    addWrappedEvents();
  }, [date,events]);

  const filteredEvents = events.filter((event: CalendarEventType) => {
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

  const addWrappedEvents = () => {
    const newWrappedEvents = wrappedEvents || [];
    filteredEvents.forEach((event) => {
      const weekEnd = event.startDate.endOf("week");
      const diffFromWeekEnd = weekEnd.diff(event.startDate, "days");
      const diffInDays = event.endDate.diff(event.startDate, "days");
      const newEventsRow = eventsRow || [];
      if(diffInDays>diffFromWeekEnd){
        newWrappedEvents.push({ id: event.id, date: weekEnd.add(1, "day"), endDate:event.endDate, rowIndex: 0 });
      }      
    });
        
    setWrappedEvents && setWrappedEvents(newWrappedEvents);
  }
  
  const currentDate = date.startOf("day");

  const extendedEvents = events.filter((event) => {
    const eventStart = dayjs(event.startDate).startOf("day");
    const eventEnd = dayjs(event.endDate).startOf("day");
    return (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate))
    || (eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate));
  });

  console.log("extendedEvents",extendedEvents);
  console.log("eventsRow" ,eventsRow);

  let filledRows:number[] = [];
  extendedEvents.forEach((event) => {
    const eventRow = eventsRow?.find(e => e.id === event.id);
    //find eventRow in wrappedEvents
    const wrappedEvent = wrappedEvents?.find(e => e.id === eventRow?.id);
    if(eventRow && (!wrappedEvent || wrappedEvent.date.isAfter(date,"day"))) {
      filledRows.push(eventRow.rowIndex);
    }
  });

  let index=0;
  wrappedEvents?.forEach((event) => {
    if(event.date.isBefore(date,"day") && event.endDate.isAfter(date,"day")){
      filledRows.push(index);
      index++;
    }
  });
  console.log("filledRows",filledRows);

  const rows=  [0,1,2,3,4]
  const emptyRows = rows.filter(row => !filledRows.includes(row));
  console.log("emptyRows",emptyRows);
  const noOfEvents = emptyRows.length -  sortedEvents.length;

  const findStartRow = () => {
    let maxRowIndex = 0;
    let isMultiDayEvent = false;    
    if(extendedEvents.length > 0){
      isMultiDayEvent = true;
    }
    // Find the maximum row index from extended events
    maxRowIndex = extendedEvents.reduce((max, event) => {
      const row = eventsRow?.find((row) => row.id === event.id);
      const wrappedEvent = wrappedEvents?.find(e => e.id === row?.id);
      let rowIndex = row?.rowIndex;
      if(wrappedEvent && wrappedEvent.date.isBefore(date,"day")){
        rowIndex = wrappedEvent.rowIndex;
      }
      return row ? Math.max(max, row.rowIndex) : max;
    }, 0);

    maxRowIndex = isMultiDayEvent ? maxRowIndex+1 : 0;


    setStartRow(maxRowIndex);

    
     
    let index = 0;

    const newEventsRow = eventsRow || [];

    sortedEvents.forEach((event) => {
      if (event.startDate.isSame(date, "day") && event.endDate.isAfter(date, "day")) {
        console.log("date",date.date());
        
        console.log("emptyRows[index]....",emptyRows[index]);
        newEventsRow.push({ id: event.id, rowIndex: emptyRows[index] });
        index++;
      }
    });

    //below line is not updating the state
    // eventsRow = newEventsRow;
    setEventsRow && setEventsRow(newEventsRow);
    setStartRow(maxRowIndex);
    
  };

  

  return (
    <div
      className={` w-full relative ${
        view === "month" ? "flex flex-col" : "flex"
      }`}
    >
      {view === "month" &&
        <>
        {
          wrappedEvents?.map((e) => {
              // return null;
              const event = events.find((event) => event.id === e.id);
              if(!event || !e.date.isSame(date,"day")) return null;
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
                    width: `calc(${100*(diffInDays-diffFromWeekEnd)}% + ${(diffInDays-diffFromWeekEnd)*2}px)`,
                  }}
                  className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px]  flex justify-start 
                    items-center cursor-pointer rounded-sm bg-[#039BE5] font-semibold p-[1px] text-[7px] 
                    sm:text-xs text-white`}
                >
                  {event.title}
                </div>
            )
          })
        }
        
        {noOfEvents>=0 ?
          <> 
            {sortedEvents.map((event, index) => {
              //find difference in number of days between start and end date
              const weekEnd = event.startDate.endOf("week");
              const diffFromWeekEnd = weekEnd.diff(event.startDate, "days")+1;
              const diffInDays = event.endDate.diff(event.startDate, "days")+1;
              let temp = emptyRows[index];
              let cnt = 0;
              while(temp > 0){
                if(index==0){
                  cnt = temp;
                  break;
                }
                temp--;
                if(emptyRows[index-1] == temp) break;
                cnt++;
              }
              
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width: `calc(${100*Math.min(diffInDays,diffFromWeekEnd)}% + ${Math.min(diffInDays,diffFromWeekEnd)*1}px)`,
                  marginTop: `${isSmallScreen ? cnt * 13 : cnt * 19}px`,
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
            {sortedEvents.slice(0, emptyRows.length).map((event, index) => {
              //find difference in number of days between start and end date
              const weekEnd = event.startDate.endOf("week");
              const diffFromWeekEnd = weekEnd.diff(event.startDate, "days")+1;
              const diffInDays = event.endDate.diff(event.startDate, "days")+1;
              let temp = emptyRows[index];
              let cnt = 0;
              while(temp > 0){
                if(index==0){
                  cnt = temp;
                  break;
                }
                temp--;
                if(emptyRows[index-1] == temp) break;
                cnt++;
              }
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width: `calc(${100*Math.min(diffInDays,diffFromWeekEnd)}% + ${Math.min(diffInDays,diffFromWeekEnd)*1}px)`,
                  marginTop: `${isSmallScreen ? cnt * 13 : cnt * 19}px`,
                }}
                className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px] mt-[${index==0?startRow*18+startRow:0}px] flex justify-start 
                  items-center cursor-pointer rounded-sm bg-[#039BE5] font-semibold p-[1px] text-[7px] 
                  sm:text-xs text-white`}
              >
                {event.title}
              </div>
            )})}
            <div
              className="z-10 line-clamp-1 h-[18px] max-sm:h-[12px] w-full m-0 flex justify-start 
                items-center cursor-pointer rounded-sm hover:bg-gray-300 text-[7px] font-semibold sm:text-xs p-[2px]
                text-gray-700 px-1"
              onClick={(e) => {
                e.stopPropagation();
                // Add logic to open a modal or show more events for the day
              }}
            >
              {`${noOfEvents+1} more`}
            </div>
          </>
        }
      
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
