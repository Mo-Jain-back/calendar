"use client";
import {
  CalendarEventType,
  useDateStore,
  useEventStore,
  useViewStore,
} from "@/lib/store";
import MonthView from "./month-view";
import SideBar from "./sidebar/SideBar";
import WeekView from "./week-view";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import { EventSummaryPopup } from "./event-summary-popover";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useMediaQuery } from "react-responsive";

export default function MainView({
  eventsData,
}: {
  eventsData: CalendarEventType[];
}) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 1024px)' });

  useEffect(() => {
    const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
      id: event.id,
      startDate: dayjs(event.startDate),
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endDate: dayjs(event.endDate),
      endTime: event.endTime,
      allDay: event.allDay,
    }));

    setEvents(mappedEvents);
  }, [eventsData, setEvents]);

  return (
    <div className="flex scrollbar-hide">
      {/* SideBar */}
    
      <SideBar />

      <div className="w-full flex-1">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopup
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
