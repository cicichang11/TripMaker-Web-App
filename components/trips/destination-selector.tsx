"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock popular destinations
const popularDestinations = [
  { value: "new-york", label: "New York, NY" },
  { value: "los-angeles", label: "Los Angeles, CA" },
  { value: "miami", label: "Miami, FL" },
  { value: "las-vegas", label: "Las Vegas, NV" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "orlando", label: "Orlando, FL" },
  { value: "san-francisco", label: "San Francisco, CA" },
  { value: "honolulu", label: "Honolulu, HI" },
  { value: "new-orleans", label: "New Orleans, LA" },
  { value: "seattle", label: "Seattle, WA" },
  { value: "paris", label: "Paris, France" },
  { value: "london", label: "London, UK" },
  { value: "rome", label: "Rome, Italy" },
  { value: "barcelona", label: "Barcelona, Spain" },
  { value: "tokyo", label: "Tokyo, Japan" },
]

interface DestinationSelectorProps {
  onSelect: (destination: string) => void
}

export function DestinationSelector({ onSelect }: DestinationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [customDestination, setCustomDestination] = useState("")
  const isInitialMount = useRef(true)

  // Prevent calling onSelect on initial render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Only call onSelect when customDestination changes and is not empty
    if (customDestination) {
      onSelect(customDestination)
    }
  }, [customDestination, onSelect])

  const handleSelect = (currentValue: string) => {
    const destination = popularDestinations.find((dest) => dest.value === currentValue)
    setValue(currentValue)

    if (destination) {
      onSelect(destination.label)
    }

    setOpen(false)
  }

  const handleCustomDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDestination(e.target.value)
    // onSelect is called in the useEffect
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {value
              ? popularDestinations.find((destination) => destination.value === value)?.label
              : customDestination || "Select destination..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search destinations..." />
            <CommandList>
              <CommandEmpty>
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">No destination found.</p>
                  <p className="text-xs text-muted-foreground mt-1">You can enter a custom destination below.</p>
                </div>
              </CommandEmpty>
              <CommandGroup heading="Popular Destinations">
                {popularDestinations.map((destination) => (
                  <CommandItem key={destination.value} value={destination.value} onSelect={handleSelect}>
                    <Check className={cn("mr-2 h-4 w-4", value === destination.value ? "opacity-100" : "opacity-0")} />
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {destination.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex items-center">
        <div className="h-px flex-1 bg-muted"></div>
        <span className="mx-2 text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-muted"></div>
      </div>

      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Enter custom destination"
          value={customDestination}
          onChange={handleCustomDestinationChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  )
}
