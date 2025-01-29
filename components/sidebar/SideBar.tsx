import { cn } from "@/lib/utils";
import React from "react";
import SideBarCalendar from "./side-bar-calendar";
import SearchUsers from "./search-users";
import MyCalendars from "./my-calendars";
import { useToggleSideBarStore } from "@/lib/store";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  return (
      <aside
        className={cn(
          "border-t py-3 transition-all  max-lg:w-0 duration-300 ease-in-out",
          {
            "lg:ml-[-220px] opacity-0 ": !isSideBarOpen,
            "ml-0  ": isSideBarOpen,
          }
        )}
        style={{ overflow: 'hidden' }}
      >
      <SideBarCalendar />
      <SearchUsers />
      <MyCalendars />
    </aside>    
  );
}
