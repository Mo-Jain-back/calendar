"use client"

import type React from "react"
import { useState } from "react"
import { X, Edit2, Trash2, Users, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { CalendarEventType } from "@/lib/store"

interface EventSummaryPopupProps {
  event: CalendarEventType
  isOpen: boolean
  onClose: () => void
  setEvents: React.Dispatch<React.SetStateAction<CalendarEventType[]>>
}

export function EventSummaryPopup({ event, isOpen, onClose, setEvents }: EventSummaryPopupProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = () => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id))
    onClose()
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
    // Implement edit functionality here
  }

  const formatDateRange = () => {
    const { startDate, endDate, startTime, endTime, allDay } = event
    if (allDay) {
      return `${startDate.format("MMM D, YYYY")} - ${endDate.format("MMM D, YYYY")}`
    }
    return `${startDate.format("MMM D, YYYY")} ${startTime} - ${endDate.format("MMM D, YYYY")} ${endTime}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: event.color || "#039BE5" }} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">You have a booking from</h2>
            <p className={`text-sm ${isEditing ? "border rounded p-1" : ""}`}>{formatDateRange()}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Booked by</p>
              <p className={`text-sm ${isEditing ? "border rounded p-1" : ""}`}>{event.bookedBy || "John Doe"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Car</p>
              <p className="text-sm">{event.car || "Tesla Model 3"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

