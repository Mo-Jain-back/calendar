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
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  const [emptyRows,setEmptyRows] = useState<number[]>([0,1,2,3,4]);
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);

  useEffect(() => {
    Initialize();
  }, [date,events]);

  const noOfEvents = emptyRows.length -  sortedEvents.length;

  const Initialize = () => {

    const filteredEvents = events.filter((event: CalendarEventType) => {
      if (view === "month") {
        return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY")
      } else if (view === "week" || view === "day") {
        return event.startDate.hour() === hour && !event.allDay;
      }
      return false;
    });
    
    const newSortedEvents = [...filteredEvents].sort((a, b) => {
      const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
      const durationB = b.endDate.diff(b.startDate, "minute");
      return durationB - durationA; // Sort in descending order (longest first)
    });

    setSortedEvents(newSortedEvents);

    const newWrappedEvents = wrappedEvents || [];
    newSortedEvents.forEach((event) => {
      const weekEnd = event.startDate.endOf("week");
      const diffFromWeekEnd = weekEnd.diff(event.startDate, "days");
      const diffInDays = event.endDate.diff(event.startDate, "days");
      const newEventsRow = eventsRow || [];
      const isPresent  = newEventsRow.find(e => e.id === event.id);
      if(diffInDays>diffFromWeekEnd && !isPresent){
        newWrappedEvents.push({ id: event.id, date: weekEnd.add(1, "day"), endDate:event.endDate, rowIndex: 0 });
      }      
    });
        
    setWrappedEvents && setWrappedEvents(newWrappedEvents);
    const currentDate = date.startOf("day");

    const extendedEvents = events.filter((event) => {
      const eventStart = dayjs(event.startDate).startOf("day");
      const eventEnd = dayjs(event.endDate).startOf("day");
      return (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate))
      || (eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate));
    });

    let filledRows:number[] = [];
    let index=0;
    extendedEvents.forEach((event) => {
      const eventRow = eventsRow?.find(e => e.id === event.id);
      //find eventRow in wrappedEvents
      if(!eventRow) return;
      const wrappedEvent = wrappedEvents?.find(e => e.id === eventRow?.id);
      if(wrappedEvent){
        if((wrappedEvent.date.isBefore(date,"day") && wrappedEvent.endDate.isAfter(date,"day"))|| wrappedEvent.endDate.isSame(date,"day") || wrappedEvent.date.isSame(date,"day") ){
          if(wrappedEvent.date.isSame(date,"day")){
            setIsWrapped(true);
          }
          filledRows.push(index);
          index++;
        }
        else{
          filledRows.push(eventRow.rowIndex);
        }
      }
      else{
        filledRows.push(eventRow.rowIndex);
      }
    });

    const rows=  [0,1,2,3,4]
    const newEmptyRows = rows.filter(row => !filledRows.includes(row));
    console.log("newEmptyRows",newEmptyRows);
    setEmptyRows((prev)=>{
      return newEmptyRows;
    });

    index = 0;
    const newEventsRow = eventsRow || [];
    newSortedEvents.forEach((event) => {
      if (event.startDate.isSame(date, "day") && event.endDate.isAfter(date, "day")) {
        console.log("date",date.date());
        
        console.log("newEmptyRows[index]....",newEmptyRows[index]);
        newEventsRow.push({ id: event.id, rowIndex: newEmptyRows[index] });
        index++;
      }
    });

    setEventsRow && setEventsRow(newEventsRow);    
  };

  const findOffset  = (index:number,event:CalendarEventType) => {
    const weekEnd = event.startDate.endOf("week");
    const diffFromWeekEnd = weekEnd.diff(event.startDate, "days")+1;
    const diffInDays = event.endDate.diff(event.startDate, "days")+1;
    console.log("date",date.date());
    console.log("emptyRows",emptyRows);
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

    if(index==0 && isWrapped){
      cnt = 0;
    }

    const width = `calc((100% + 1px)*${Math.min(diffInDays,diffFromWeekEnd)})`;
    const marginTop = `${isSmallScreen ? cnt * 13 : cnt * 19}px`;
    return {width,marginTop};
  }



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
                    width: `calc((100% + 1px)*${diffInDays-diffFromWeekEnd})`,
                  }}
                  className={`z-10 line-clamp-1 mb-[1px] max-sm:h-[12px] h-[18px]  flex justify-start 
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
              const {width,marginTop} = findOffset(index,event);
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width,
                  marginTop
                }}
                className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px] flex justify-start 
                  items-center cursor-pointer rounded-sm bg-[#039BE5] font-semibold p-[1px] text-[7px] 
                  sm:text-xs text-white`}
              >
                {event.title} 
              </div>
            )})}
          </>
          :
          <>
            {sortedEvents.slice(0, emptyRows.length-1).map((event, index) => {
              //find difference in number of days between start and end date
              const {width,marginTop} = findOffset(index,event);
              return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openEventSummary(event);
                }}
                style={{
                  width,
                  marginTop
                }}
                className={`z-10 line-clamp-1 my-[1px]  max-sm:h-[12px] h-[18px] flex justify-start 
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
              {`${noOfEvents*(-1)} more`}
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
