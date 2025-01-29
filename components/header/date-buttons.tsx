"use client";
import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import SideBarCalendar from "../sidebar/side-bar-calendar";
import { useMediaQuery } from "react-responsive";

const DateButtons = ({open}:{open:boolean}) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Nov","Dec"];
    const todaysDate = dayjs();
    const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
        useDateStore();
    const [selectedMonth,setSelectedMonth] = useState(todaysDate.format("MMM"));
    const { selectedView } = useViewStore();
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' }); 

    useEffect(() => {
        setSelectedMonth(months[selectedMonthIndex]);
    }, [selectedMonthIndex]);
    
    const handleClick = (month:string,index:number) => {
        setSelectedMonth(month);
        const difference = index-selectedMonthIndex;
        setMonth(index);
        if(difference>0){
          setDate(userSelectedDate.add(difference, "month"));
        }else if(difference<0){
          setDate(userSelectedDate.subtract(difference*(-1), "month"));
        }
    }
    return (
        <>
          {
            isSmallScreen && 
            <div className={`${open ? "mt-0 " : "sm:mt-[-58px] mt-[-60px] opacity-0 " }  duration-300 ease-in-out`}>
              <div className={`${(selectedView != "month" && !open) ? "mt-[-370px] opacity-0" : "mt-[-30px] mb-[0]" } my-0 duration-300 ease-in-out`} >
                  {selectedView != "month" &&
                    <SideBarCalendar/>}
              </div>
              <div className="relative flex mt-[-25px] w-full justify-around p-2 overflow-scroll scrollbar-hide">
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
            </div>
          }
        </>
    )
}

export default DateButtons;