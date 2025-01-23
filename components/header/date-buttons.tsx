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
        const difference = index-selectedMonthIndex;
        switch (selectedView) {
            case "month":
              setMonth(index);
              break;
            case "week":
              if(difference>0){
                setDate(userSelectedDate.add(4*difference, "week"));
              }else if(difference<0){
                setDate(userSelectedDate.subtract(4.34*difference*(-1), "week"));
              } 
              setMonth(index);
              break;
            case "day":
              setDate(userSelectedDate.add(30, "day"));
              setMonth(index);
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
                  { 
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