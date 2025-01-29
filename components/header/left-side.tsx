"use client";

import React, { useState } from "react";
import {  Menu } from "lucide-react";
import { BsCaretDownFill } from "react-icons/bs";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import TestComponent from "./test";

export default function HeaderLeft(
  {setOpen}:
  {setOpen: React.Dispatch<React.SetStateAction<boolean>>}
) {
  const todaysDate = dayjs();
  const [color, setColor] = useState('#ffffff');
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
    useDateStore();

  const { setSideBarOpen } = useToggleSideBarStore();

  const { selectedView } = useViewStore();

  const handleTodayClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(dayjs().month());
        break;
      case "week":
        setDate(todaysDate);
        break;
      case "day":
        setDate(todaysDate);
        setMonth(dayjs().month());
        break;
      default:
        break;
    }
  };

  const handlePrevClick = () => {
    let currentMonthIndex;
    const endOfWeek = userSelectedDate.endOf("week");
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex - 1);
        break;
      case "week":
        currentMonthIndex = endOfWeek.subtract(1, "week").month();
        setDate(endOfWeek.subtract(1, "week"));
        if(currentMonthIndex < selectedMonthIndex){
          setMonth(selectedMonthIndex - 1);
        }
        break;
      case "day":
        currentMonthIndex = userSelectedDate.subtract(1, "day").month();
        setDate(userSelectedDate.subtract(1, "day"));
        if(currentMonthIndex < selectedMonthIndex){
          setMonth(selectedMonthIndex - 1);
        }
        break;
      default:
        break;
    }
  };

  const handleNextClick = () => {
    let currentMonthIndex = userSelectedDate.month();
    const startOfWeek = userSelectedDate.startOf("week");
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex + 1);
        break;
      case "week":
        currentMonthIndex = startOfWeek.add(1, "week").month();
        setDate(startOfWeek.add(1, "week"));
        if(currentMonthIndex > selectedMonthIndex){
          setMonth(selectedMonthIndex + 1);
        }
        break;
      case "day":
        currentMonthIndex = userSelectedDate.add(1, "day").month();
        setDate(userSelectedDate.add(1, "day"));
        if(currentMonthIndex > selectedMonthIndex){
          setMonth(selectedMonthIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center sm:gap-3">
      {/* Sidebar Toggle and Calendar Icon */}
      <div className="hidden items-center lg:flex">
        <Button
          variant="ghost"
          className="rounded-full p-2"
          onClick={() => setSideBarOpen()}
        >
          <Menu className="size-6" />
        </Button>
        <Image
          src={`/img/calendar_${todaysDate.date().toString()}_2x.png`}
          width={40}
          height={40}
          alt="icon"
        />
        <h1 className="text-xl select-none">Calendar</h1>
      </div>

      {/* Today Button */}
      <Button variant="outline" className="text-xs select-none sm:text-sm px-2 py-1" onClick={handleTodayClick}>
        Today
      </Button>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <MdKeyboardArrowLeft
          className="size-6 cursor-pointer font-bold"
          onClick={handlePrevClick}
        />
        <MdKeyboardArrowRight
          className="size-6 cursor-pointer font-bold"
          onClick={handleNextClick}
        />
      </div>

      {/* Current Month and Year Display */}
      <h1 className={`text-sm ml-2 sm:ml-0 h-fit w-fit sm:text-xl block flex justify-around items-center`} style={{ backgroundColor: color }}>
        <div className="sm:pb-1">
        {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
          "MMMM YYYY",
        )}</div>
      </h1>
        <BsCaretDownFill  className="text-xl sm:hidden min-size-3 ml-1 border border-gray-200 rounded-md p-1 h-fit" 
        onClick={() => setOpen((open)=> !open)}
        />
    </div>
  );
}
