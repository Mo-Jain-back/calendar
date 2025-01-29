"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useViewStore } from "@/lib/store";

export default function HeaderRight(
  {setOpen}:
  {setOpen: React.Dispatch<React.SetStateAction<boolean>>}
) {

  const { setView } = useViewStore();

  const handleStreamView = (v:string) => {
    setView(v);
    setOpen(false);
  }

  return (
    <div className="flex items-center space-x-4">
    {/* <SearchComponent /> */}
    <Select onValueChange={(v) => handleStreamView(v) }>
      <SelectTrigger className="sm:w-24 select-none w-18 p-1 sm:p-2 text-xs sm:text-sm active:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="day">Day</SelectItem>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger style={{marginLeft:"2px"}} className="sm:w-24 select-none w-18 p-1 sm:p-2 m-0 text-xs sm:text-sm active:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
        <SelectValue placeholder="Cars" />
      </SelectTrigger>
      <SelectContent>
      <SelectItem value="all">All</SelectItem>
        <SelectItem value="tesla">Tesla</SelectItem>
        <SelectItem value="maruti">Maruti</SelectItem>
        <SelectItem value="audi">Audi</SelectItem>
      </SelectContent>
    </Select>
  </div>
  )
}
