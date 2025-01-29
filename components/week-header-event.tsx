import { CalendarEventType, useEventRows, useEventStore, useWrappedEvent, WrappedEvent } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive";

const HeaderEvent = ({index,date,today}:{index:number,date:Dayjs,today:boolean}) => {
    const { openEventSummary } = useEventStore();
    const { events } = useEventStore();
    const [isEventHidden, setIsEventHidden] = useState(true);
    const currentDate = date.startOf("day");
    const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);
    const [isWrapped, setIsWrapped] = useState<boolean>(false);
    const [emptyRows,setEmptyRows] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
    const {eventsRow} = useEventRows();
    const {wrappedEvents} = useWrappedEvent();
    const [noOfEvents,setNoOfEvents] = useState(0);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
    const isSizeExtraSmall = useMediaQuery({ query: '(max-width: 400px)' });

    useEffect(() => {
      Initialize();
    }, [date,events]);
        
    const Initialize = () => {
      const filteredEvents = events.filter((event: CalendarEventType) => {
        return event.startDate.format("DD-MM-YY") === date.format("DD-MM-YY")
      });
      
      const newSortedEvents = [...filteredEvents].sort((a, b) => {
        const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
        const durationB = b.endDate.diff(b.startDate, "minute");
        return durationB - durationA; // Sort in descending order (longest first)
      });
  
      setSortedEvents(newSortedEvents);

      
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
            if((wrappedEvent.startDate.isBefore(date,"day") && wrappedEvent.endDate.isAfter(date,"day"))|| wrappedEvent.endDate.isSame(date,"day") || wrappedEvent.startDate.isSame(date,"day") ){
              if(wrappedEvent.startDate.isSame(date,"day")){
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

      setNoOfEvents(filledRows.length);
  
      const rows=  [0,1,2,3,4,5,6,7,8,9]
      const newEmptyRows = rows.filter(row => !filledRows.includes(row));
      setEmptyRows(newEmptyRows);
    }

    const findOffset  = (index:number,event:CalendarEventType | WrappedEvent,isWrap:boolean=false) => {
      const weekEnd = event.startDate.endOf("week");
      const weekendDuration = weekEnd.diff(event.startDate, "days")+1;
      const eventDuration = event.endDate.diff(event.startDate, "days")+1;
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

      const singleEventWidth =  "100%";
      
      let width = `calc(${singleEventWidth} * ${Math.min(eventDuration, weekendDuration)} - 1px)`;
      let marginTop = `${isSmallScreen ? cnt * 13 : cnt * 18}px`;
      if(isWrap){
        width=`calc(${singleEventWidth}*${eventDuration} - 1px)`
        marginTop = "0"
      }
      // width = "100%"
      return {width,marginTop};
    }

    const renderEvent = (event: CalendarEventType, index: number, width: string, marginTop: string | number) => {
      return (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            openEventSummary(event);
          }}
          style={{
            width,
            marginTop,
            minWidth:"30px"
          }}
          className={cn(
            "my-[1px] max-sm:h-[12px] w-full flex items-center justify-center cursor-pointer rounded-sm bg-blue-700 text-[7px] sm:text-xs text-white overflow-hidden whitespace-nowrap",
            isSmallScreen ? "text-[9px]" : "px-2 text-[12px]"
          )}
        >
          <span className="truncate">{event.title}</span>
        </div>
      );
    };
  
    return (
      <div key={index} className="flex flex-col min-w-[30px] items-center justify-start w-full">
        <div className={cn("text-xs mt-6 sm:mt-8", today && "text-blue-600")}>
          {currentDate.format("ddd")}
        </div>
        <div
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 text-center flex items-center rounded-full p-2 text-sm sm:text-lg",
            today && "bg-blue-600 text-white min-w-[30px]"
          )}
        >
          {currentDate.format("DD")}{" "}
        </div>
        <div
          className="flex flex-col w-full transition-all duration-500 ease-in-out"
          style={{ maxHeight: isEventHidden ? "40px sm:60px" : "" }}
        >
          {wrappedEvents?.map((e, index) => {
            const event = events.find((event) => event.id === e.id);
            if (!event || !e.startDate.isSame(date, "day")) return null;
            const { width, marginTop } = findOffset(index, e, true);
            return renderEvent(event, index, width, marginTop);
          })}
          {noOfEvents < 4 || !isEventHidden ? (
            sortedEvents.map((event, index) => {
              const { width, marginTop } = findOffset(index, event);
              return renderEvent(event, index, width, marginTop);
            })
          ) : (
            <>
              {sortedEvents.slice(0, 2).map((event, index) => {
                const { width, marginTop } = findOffset(index, event);
                return renderEvent(event, index, width, marginTop);
              })}
              <div className="text-xs sm:text-sm px-2">+{noOfEvents - 2}</div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default HeaderEvent;