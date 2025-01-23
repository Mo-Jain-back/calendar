"use client";
import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import { useState } from "react";
import SideBarCalendar from "../sidebar/side-bar-calendar";

const DateButtons = ({open}:{open:boolean}) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Nov","Dec"];
    const todaysDate = dayjs();
    const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
        useDateStore();

    const [selectedMonth,setSelectedMonth] = useState(todaysDate.format("MMM"));
    const { selectedView } = useViewStore();
    const handleClick = (month:string,index:number) => {
        setSelectedMonth(month);
        switch (selectedView) {
            case "month":
              setMonth(index);
              break;
            case "week":
              setDate(userSelectedDate.subtract(1, "week"));
              break;
            case "day":
              setDate(userSelectedDate.subtract(1, "day"));
              break;
            default:
              break;
          }
    }
    return (
        <>
          {
            open &&
            <>
              <div >
                {selectedView != "month" &&
                  <SideBarCalendar/>
                }
              </div>
              <div className="relative flex w-full justify-around p-2">
                  { selectedView == "month" &&
                  months.map((month,index) => (
                      <div className={`p-1 text-sm ${selectedMonth===month ?"bg-gray-200":"bg-white"} cursor-pointer px-2 border border-gray-400 rounded-md`}
                      onClick = {() => handleClick(month,index)}
                      >
                      {month}
                      </div>
                  ))
                  }
              </div>
            </>
          }
        </>
    )
}

export default DateButtons;