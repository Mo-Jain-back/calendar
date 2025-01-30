"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewStore } from "@/lib/store";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CarsFilters from "../sidebar/cars-filter";

export default function HeaderRight(
  {setOpen}:
  {setOpen: React.Dispatch<React.SetStateAction<boolean>>}
) {

  const { setView } = useViewStore();

  const handleStreamView = (v:string) => {
    setView(v);
    setOpen(false);
  }

  const handleCarsCheck = () => {
    return null
  }

  const myCars = [
    { id: "cal1", title: "Tesla Mode 3", color: "accent-red-600" },
    { id: "cal2", title: "Maruti", color: "accent-blue-600" },
    { id: "cal3", title: "Audi", color: "accent-green-600" },
  ];

  return (
    <div className="flex items-center space-x-4 pr-2">
    {/* <SearchComponent /> */}
    <Select onValueChange={(v) => handleStreamView(v) }>
      <SelectTrigger className="sm:w-24 select-none w-18 p-1 sm:p-2 text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="day">Day</SelectItem>
      </SelectContent>
    </Select>
    <div className="lg:hidden">
      <Popover>
        <PopoverTrigger className="w-[50px] p-2 rounded-sm border" >
        <Car className="h-5 w-5 " />
        </PopoverTrigger>
        <PopoverContent >
          <CarsFilters/>
        </PopoverContent>
      </Popover>
    </div>
    
  </div>
  )
}
