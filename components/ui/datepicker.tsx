"use client"

import {useEffect, useState} from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dayjs } from "dayjs"
import { Input } from "./input"

export function DatePicker({currDate,handleDateChange,dateType,className}:{currDate:Dayjs,handleDateChange:(date:Date,type?:string)=>void,dateType?:string,className?:string}) {
  const [date, setDate] = useState<Date>(currDate.toDate());
  const [dateText, setDateText] = useState<string>(format(date, "MMM d, yyyy"));

  useEffect(() => {
    handleDateChange(date,dateType);
    setDateText(format(date, "MMM d, yyyy"));
  }, [date])

  const handleDateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateText = e.target.value;
    setDateText(newDateText);
    const newDate = new Date(newDateText);
    setDate(newDate);
  };

  return (
    <div>
    <Popover>
      <PopoverTrigger asChild>
        <Input value={dateText} onChange={handleDateTextChange} type="text"
        className={cn(
            " p-1 w-[90px] m-0 focus-visible:border-b-4 focus-visible:border-blue-400  focus-visible:ring-0  cursor-text bg-gray-200 rounded-sm hover:bg-gray-300  justify-start text-left font-normal",
            !date && "text-muted-foreground "
          )}
        ></Input>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => setDate(date || new Date())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    </div>
  )
}
