"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Check, X, InfoIcon as InfoCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AvailabilityCalendarProps {
  tripId: string
}

// Mock data for participant availability
const participantAvailability = [
  {
    id: "1",
    name: "John Doe",
    image: "/diverse-person.png",
    availability: [{ start: new Date(2025, 6, 15), end: new Date(2025, 6, 25) }],
  },
  {
    id: "2",
    name: "Jane Smith",
    image: "/diverse-group-two.png",
    availability: [{ start: new Date(2025, 6, 10), end: new Date(2025, 6, 20) }],
  },
  {
    id: "3",
    name: "Bob Johnson",
    image: "/diverse-group-outdoors.png",
    availability: [{ start: new Date(2025, 6, 15), end: new Date(2025, 6, 22) }],
  },
  {
    id: "4",
    name: "Alice Williams",
    image: "/diverse-group-four.png",
    availability: [{ start: new Date(2025, 6, 12), end: new Date(2025, 6, 22) }],
  },
]

// Calculate optimal dates based on participant availability
const calculateOptimalDates = (participants: typeof participantAvailability, duration: number) => {
  // Create a map of dates to count of available participants
  const dateAvailability = new Map<string, number>()

  // For each participant
  participants.forEach((participant) => {
    // For each availability range
    participant.availability.forEach((range) => {
      const start = new Date(range.start)
      const end = new Date(range.end)

      // For each day in the range
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split("T")[0]
        dateAvailability.set(dateString, (dateAvailability.get(dateString) || 0) + 1)
      }
    })
  })

  // Find the best consecutive days
  let bestStartDate: string | null = null
  let bestScore = 0

  // Convert map to array and sort by date
  const dateEntries = Array.from(dateAvailability.entries()).sort((a, b) => a[0].localeCompare(b[0]))

  for (let i = 0; i < dateEntries.length - duration + 1; i++) {
    let totalScore = 0

    // Calculate score for this range
    for (let j = 0; j < duration; j++) {
      if (i + j < dateEntries.length) {
        totalScore += dateEntries[i + j][1]
      }
    }

    if (totalScore > bestScore) {
      bestScore = totalScore
      bestStartDate = dateEntries[i][0]
    }
  }

  if (bestStartDate) {
    const start = new Date(bestStartDate)
    const end = new Date(start)
    end.setDate(end.getDate() + duration - 1)

    return {
      start,
      end,
      score: bestScore / (duration * participants.length), // Normalize score
    }
  }

  return null
}

// Calculate optimal dates for a 7-day trip
const optimalDates = calculateOptimalDates(participantAvailability, 7)

export function AvailabilityCalendar({ tripId }: AvailabilityCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(undefined)
  const [isAddingAvailability, setIsAddingAvailability] = useState(false)

  // Function to check if a date is within any participant's availability
  const isDateAvailable = (date: Date, participantId?: string) => {
    const participants = participantId
      ? participantAvailability.filter((p) => p.id === participantId)
      : participantAvailability

    return participants.some((participant) =>
      participant.availability.some((range) => date >= range.start && date <= range.end),
    )
  }

  // Function to get the count of available participants for a date
  const getAvailableCount = (date: Date) => {
    return participantAvailability.filter((participant) => isDateAvailable(date, participant.id)).length
  }

  // Custom day render function for the calendar
  const renderDay = (day: Date) => {
    const availableCount = getAvailableCount(day)
    const totalParticipants = participantAvailability.length

    // Check if this date is part of the optimal range
    const isOptimal = optimalDates && day >= optimalDates.start && day <= optimalDates.end

    return (
      <div
        className={`relative w-full h-full flex items-center justify-center ${
          isOptimal ? "bg-emerald-50 dark:bg-emerald-950/20" : ""
        }`}
      >
        <div className="text-center">
          {day.getDate()}
          {availableCount > 0 && (
            <div
              className={`text-xs mt-1 ${
                availableCount === totalParticipants
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {availableCount}/{totalParticipants}
            </div>
          )}
        </div>
        {isOptimal && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500"></div>}
      </div>
    )
  }

  const handleAddAvailability = () => {
    setIsAddingAvailability(true)
    setSelectedDates([])
  }

  const handleSaveAvailability = () => {
    // In a real app, this would save the availability to the database
    console.log("Saving availability:", selectedDates)
    setIsAddingAvailability(false)
    setSelectedDates(undefined)
  }

  const handleCancelAvailability = () => {
    setIsAddingAvailability(false)
    setSelectedDates(undefined)
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 mb-4">
        <InfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          <p className="font-medium">How TripMaker's Availability Feature Works:</p>
          <p className="text-sm mt-1">
            Each group member selects dates they're available to travel. TripMaker then analyzes everyone's availability
            to find the optimal date ranges where most or all members can participate. This helps your group make the
            final decision on when to travel.
          </p>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Group Availability Calendar</h3>
          <p className="text-sm text-muted-foreground">Select dates when you're available for this trip</p>
        </div>
        {!isAddingAvailability ? (
          <Button onClick={handleAddAvailability} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add My Availability
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSaveAvailability} className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancelAvailability}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode={isAddingAvailability ? "multiple" : "default"}
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded-md border"
            components={{
              Day: ({ date }) => renderDay(date),
            }}
            disabled={{ before: new Date() }}
            numberOfMonths={2}
          />
        </div>
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Optimal Dates</h4>
              {optimalDates ? (
                <div className="space-y-2">
                  <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/20 p-3">
                    <p className="text-sm font-medium">
                      {optimalDates.start.toLocaleDateString()} - {optimalDates.end.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(optimalDates.score * 100)}% availability match
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not enough availability data to calculate optimal dates.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h4 className="font-medium">Participant Availability</h4>
            <div className="space-y-2">
              {participantAvailability.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={participant.image || "/placeholder.svg"} alt={participant.name} />
                    <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{participant.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {participant.availability.length} ranges
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
                <span>All available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                <span>Some available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/20 mr-2"></div>
                <span>Optimal dates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
