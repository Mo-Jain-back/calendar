"use client";
import { useState } from "react";
import HeaderLeft from "./left-side";
import DateButtons from "./date-buttons";
import HeaderRight from "./right-side";

export default function Header() {
  const [openMonthButtons,setOpenMonthButtons] = useState(false);
  return (
    <div>
      <div className={`mx-3 flex items-center justify-between py-2 `}>
        <HeaderLeft setOpen={setOpenMonthButtons}/>
        <HeaderRight setOpen={setOpenMonthButtons}/>
      </div>
      <DateButtons open={openMonthButtons}/>
    </div>
  );
}
