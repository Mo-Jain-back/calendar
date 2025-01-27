"use client";

import React, { Fragment, useEffect, useState } from 'react'
import MonthViewBox from './month-view-box'
import { useDateStore } from '@/lib/store';
import { Dayjs } from 'dayjs';

export type EventsRow = {
  id:string;
  rowIndex:number;
}
export type WrappedEvents = {
  id:string;
  date:Dayjs;
  endDate:Dayjs;
  rowIndex:number;
}
export default function MonthView() {

  const { twoDMonthArray } = useDateStore();
    
  // const [eventsRow, setEventsRow] = useState<EventsRow[]>([]);
  const [eventsRow, setEventsRow] = useState<EventsRow[]>([]);
  const [wrappedEvents, setWrappedEvents] = useState<WrappedEvents[]>([]);
  return (
    <section className='grid grid-cols-7 grid-rows-5 lg:h-[100vh] overflow-hidden'>
     {twoDMonthArray.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, index) => (
            <MonthViewBox key={index} day={day} rowIndex={i} eventsRow={eventsRow} setEventsRow={setEventsRow} wrappedEvents={wrappedEvents} setWrappedEvents={setWrappedEvents}  />
          ))}
        </Fragment>
      ))}
    </section>
  )
}
