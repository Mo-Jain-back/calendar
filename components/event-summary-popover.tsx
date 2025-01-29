"use client"

import type React from "react"
import { useState } from "react"
import { X, Edit2, Trash2, Users, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEventStore, type CalendarEventType } from "@/lib/store"
import { Input } from "@/components/ui/input"

interface EventSummaryPopupProps {
  event: CalendarEventType
  isOpen: boolean
  onClose: () => void
}

export function EventSummaryPopup({ event, isOpen, onClose }: EventSummaryPopupProps) {
  const {events,setEvents} = useEventStore();
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState(event);
  const [startDate,setStartDate] = useState(event.startDate);
  const [endDate,setEndDate] = useState(event.endDate);
  const [startTime,setStartTime] = useState(event.startTime);
  const [endTime,setEndTime] = useState(event.endTime);
  const [bookedBy,setBookedBy] = useState("John Doe");
  const [color,setColor] = useState("#039BE5");

  const handleDelete = () => {
    const updatedEvents = events.filter((e) => e.id !== event.id)
    setEvents(updatedEvents)
    onClose()
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = () => {
    const updatedEvents = events.map((e) => (e.id === event.id ? editedEvent : e))
    setEvents(updatedEvents)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEvent((prev) => ({ ...prev, [name]: value }))
  }
  return (
    <Dialog open={isOpen}  onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-sm:h-[90%] flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">You have a booking from</h2>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  type="date"
                  name="startDate"
                  value={startDate.format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  className="bg-gray-100"
                />
                {!event.allDay && (
                  <Input
                    type="time"
                    name="startTime"
                    value={startTime}
                    onChange={handleInputChange}
                    className="bg-gray-100"
                  />
                )}
                <Input
                  type="date"
                  name="endDate"
                  value={endDate.format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  className="bg-gray-100"
                />
                {!event.allDay && (
                  <Input
                    type="time"
                    name="endTime"
                    value={endTime}
                    onChange={handleInputChange}
                    className="bg-gray-100"
                  />
                )}
              </div>
            ) : (
              <p className="text-sm">
                {event.allDay
                  ? `${startDate.format("MMM D, YYYY")} - ${endDate.format("MMM D, YYYY")}`
                  : `${startDate.format("MMM D, YYYY")} ${startTime} - ${endDate.format("MMM D, YYYY")} ${endTime}`}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-start space-x-2">
            <Users className="h-5 w-5 mt-1" />
            <div>
              <p className="text-sm font-medium">Booked by</p>
              {isEditing ? (
                <Input
                  name="bookedBy"
                  value={bookedBy}
                  onChange={handleInputChange}
                  className="bg-gray-100"
                />
              ) : (
                <p className="text-sm">{bookedBy}</p>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Car className="h-5 w-5 mt-1" />
            <div>
              <p className="text-sm font-medium">Car</p>
              <p className="text-sm">{event.car || "Tesla Model 3"}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4">
            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
