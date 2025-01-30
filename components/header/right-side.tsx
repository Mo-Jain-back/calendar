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
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <Select onValueChange={(v) => handleCarsCheck() }>
        <SelectTrigger className="w-[50px] p-0 px-1 focus-visible:ring-0" >
        <Car className="h-5 w-5 " />
        </SelectTrigger>
        <SelectContent>
          {myCars.map((cal) => (
              <div className="items-top flex space-x-2 py-2" key={cal.id}>
                <input
                  type="checkbox"
                  id={cal.id}
                  
                  className={cn("h-4 w-4 rounded-none selected-true", `${cal.color}`)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={cal.id}
                    className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cal.title}
                  </label>
                </div>
              </div>
            ))}
        </SelectContent>
      </Select>
    </div>
    
  </div>
  )
}
