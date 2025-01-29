import { cn } from "@/lib/utils";
import React from "react";
import Create from "./create";
import SideBarCalendar from "./side-bar-calendar";
import SearchUsers from "./search-users";
import MyCalendars from "./my-calendars";
import { useToggleSideBarStore } from "@/lib/store";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  return (
      <aside
        className={cn(
          "border-t py-3 transition-all max-lg:w-0 duration-300 ease-in-out",
          {
            "lg:w-60 lg:opacity-100": isSideBarOpen,
            "w-0 opacity-0 ": !isSideBarOpen,
          }
        )}
        style={{ overflow: 'hidden' }}
      >
      <Create />
      <SideBarCalendar />
      <SearchUsers />
      <MyCalendars />
    </aside>    
  );
}
