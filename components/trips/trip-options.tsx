"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface TripOption {
  id: string
  title: string
  description: string
  price: number
  votes: number
  type: string
}

interface TripOptionsProps {
  tripId: string
  options: {
    flights: TripOption[]
    hotels: TripOption[]
    activities: TripOption[]
  }
}

export function TripOptions({ tripId, options }: TripOptionsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("flights")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newOption, setNewOption] = useState({
    type: "flights",
    title: "",
    description: "",
    price: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVote = async (optionId: string, vote: "up" | "down") => {
    try {
      // In a real app, this would send a request to the server to update the vote
      console.log(`Voting ${vote} for option ${optionId}`)

      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote",
        variant: "destructive",
      })
    }
  }

  const handleAddOption = async () => {
    if (!newOption.title || !newOption.price) {
      toast({
        title: "Missing information",
        description: "Please provide a title and price",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would send a request to the server to add a new option
      console.log("Adding new option:", newOption)

      toast({
        title: "Option added",
        description: "Your option has been added successfully",
      })

      setDialogOpen(false)
      setNewOption({
        type: activeTab,
        title: "",
        description: "",
        price: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add option",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewOption((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setNewOption((prev) => ({ ...prev, type: value }))
    setActiveTab(value)
  }

  const renderOptionCard = (option: TripOption) => (
    <Card key={option.id} className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{option.title}</CardTitle>
          <Badge variant="outline">${option.price}</Badge>
        </div>
        <CardDescription>{option.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4 mr-1" />
          {option.votes} votes
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-green-600"
            onClick={() => handleVote(option.id, "up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-red-600"
            onClick={() => handleVote(option.id, "down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  const renderOptions = () => {
    switch (activeTab) {
      case "flights":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {options.flights.length > 0 ? (
              options.flights.map(renderOptionCard)
            ) : (
              <div className="col-span-2 text-center p-4 text-muted-foreground">
                No flight options yet. Add one to get started!
              </div>
            )}
          </div>
        )
      case "hotels":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {options.hotels.length > 0 ? (
              options.hotels.map(renderOptionCard)
            ) : (
              <div className="col-span-2 text-center p-4 text-muted-foreground">
                No hotel options yet. Add one to get started!
              </div>
            )}
          </div>
        )
      case "activities":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {options.activities.length > 0 ? (
              options.activities.map(renderOptionCard)
            ) : (
              <div className="col-span-2 text-center p-4 text-muted-foreground">
                No activity options yet. Add one to get started!
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "flights" ? "default" : "outline"}
            onClick={() => setActiveTab("flights")}
            className={activeTab === "flights" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Flights
          </Button>
          <Button
            variant={activeTab === "hotels" ? "default" : "outline"}
            onClick={() => setActiveTab("hotels")}
            className={activeTab === "hotels" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Hotels
          </Button>
          <Button
            variant={activeTab === "activities" ? "default" : "outline"}
            onClick={() => setActiveTab("activities")}
            className={activeTab === "activities" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Activities
          </Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Option</DialogTitle>
              <DialogDescription>Add a new flight, hotel, or activity option for your trip.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newOption.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flights">Flight</SelectItem>
                    <SelectItem value="hotels">Hotel</SelectItem>
                    <SelectItem value="activities">Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newOption.title}
                  onChange={handleInputChange}
                  placeholder="e.g., American Airlines Flight"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newOption.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Round trip from JFK to MIA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newOption.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 350"
                />
              </div>
              <Button onClick={handleAddOption} className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Option"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {renderOptions()}
    </div>
  )
}
