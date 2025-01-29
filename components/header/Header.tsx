"use client";
import { useState } from "react";
import HeaderLeft from "./left-side";
import DateButtons from "./date-buttons";
import HeaderRight from "./right-side";

export default function Header() {
  const [openMonthButtons,setOpenMonthButtons] = useState(false);
  return (
    <div>
      <div className={`mx-3 absolute  z-10 top-0 left-0 w-[95%] bg-white flex items-center justify-between py-2 scrollbar-hide `}>
        <HeaderLeft setOpen={setOpenMonthButtons}/>
        <HeaderRight setOpen={setOpenMonthButtons}/>
      </div>
      <div className="sm:h-[58px] h-[70px]"></div>
      <DateButtons open={openMonthButtons}/>
    </div>
  );
}
