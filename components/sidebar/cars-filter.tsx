"use client";

import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

const myCars = [
  { id: "cal1", title: "Tesla Mode 3", color: "accent-red-600" },
  { id: "cal2", title: "Maruti", color: "accent-blue-600" },
  { id: "cal3", title: "Audi", color: "accent-green-600" },
];

type CalendarEventType = {
  id: string;
  title: string;
  car:string;
  startDate: Dayjs;
  endDate: Dayjs;
  description: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
}
type Car = {
  id: string;
  title: string;
  color: string;
}

const allEvents: CalendarEventType[] = [
  {
    id: "event1",
    title: "Event 1",
    car: "cal1",
    startDate: dayjs().add(1, "day"),
    endDate: dayjs().add(2, "day"),
    description: "Event 1 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
  {
    id: "event2",
    title: "Event 2",
    car: "cal2",
    startDate: dayjs().add(2, "day"),
    endDate: dayjs().add(3, "day"),
    description: "Event 2 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
  {
    id: "event3",
    title: "Event 3",
    car: "cal3",
    startDate: dayjs().add(3, "day"),
    endDate: dayjs().add(4, "day"),
    description: "Event 3 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
];

export default function CarsFilters() {
  const [selectedCars, setSelectedCars] = useState<string[]>(myCars.map(car => car.id));

  const handleCheckboxChange = (carId: string) => {
    setSelectedCars((prevSelected) => {
      const newSelection = prevSelected.includes(carId)
        ? prevSelected.filter(id => id !== carId)
        : [...prevSelected, carId];
      
      const filteredEvents = allEvents.filter(event => newSelection.includes(event.car));
      // setEvents(filteredEvents);
      return newSelection;
    });
  };
  return (
    <div>
          {myCars.map((car) => (
            <div className="flex items-center  space-x-3 " key={car.id}>
              <input
                type="checkbox"
                id={car.id}
                checked={selectedCars.includes(car.id)}
                onChange={() => handleCheckboxChange(car.id)}
                className={cn("h-4 w-4 rounded-none", `${car.color}`)}
              />
              <div className="flex items-center">
                <label
                  htmlFor={car.id}
                  className="text-sm font-medium text-center py-2 leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {car.title}
                </label>
              </div>
            </div>
          ))}
        </div>
  );
}
