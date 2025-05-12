"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Users, DollarSign, Calendar, Clock, InfoIcon as InfoCircle } from "lucide-react"
import { AvailabilityCalendar } from "@/components/trips/availability-calendar"
import { TripOptions } from "@/components/trips/trip-options"
import { TripDiscussion } from "@/components/trips/trip-discussion"
import { TripParticipants } from "@/components/trips/trip-participants"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

// Mock trip data
const tripData = {
  id: "1",
  name: "Summer Beach Vacation",
  description:
    "A relaxing week at the beach with friends. We'll enjoy the sun, sand, and surf, and explore the local restaurants and nightlife.",
  destination: "Miami, FL",
  startDate: "2025-07-15",
  endDate: "2025-07-22",
  status: "planning",
  budget: 5000,
  perPersonBudget: 1250,
  image: "/miami-beach-scene.png",
  group: {
    id: "1",
    name: "College Friends",
    members: 8,
  },
  participants: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      image: "/diverse-person.png",
      role: "organizer",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      image: "/diverse-group-two.png",
      role: "participant",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      image: "/diverse-group-outdoors.png",
      role: "participant",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      image: "/diverse-group-four.png",
      role: "participant",
    },
  ],
  options: {
    flights: [
      {
        id: "1",
        title: "American Airlines",
        description: "Round trip from JFK to MIA",
        price: 350,
        votes: 2,
      },
      {
        id: "2",
        title: "Delta Airlines",
        description: "Round trip from LGA to MIA",
        price: 320,
        votes: 1,
      },
    ],
    hotels: [
      {
        id: "3",
        title: "Beachfront Resort",
        description: "4-star hotel with ocean view",
        price: 1200,
        votes: 3,
      },
      {
        id: "4",
        title: "Downtown Hotel",
        description: "3-star hotel in the city center",
        price: 800,
        votes: 0,
      },
    ],
    activities: [
      {
        id: "5",
        title: "Jet Skiing",
        description: "2-hour jet ski rental",
        price: 120,
        votes: 4,
      },
      {
        id: "6",
        title: "Snorkeling Tour",
        description: "Half-day snorkeling tour",
        price: 80,
        votes: 2,
      },
    ],
  },
  comments: [
    {
      id: "1",
      userId: "1",
      userName: "John Doe",
      userImage: "/diverse-person.png",
      content: "I'm really excited for this trip! I've been wanting to go to Miami for years.",
      createdAt: "2025-05-10T14:30:00Z",
    },
    {
      id: "2",
      userId: "2",
      userName: "Jane Smith",
      userImage: "/diverse-group-two.png",
      content: "Me too! Does anyone have preferences for which part of the beach we should stay near?",
      createdAt: "2025-05-10T15:45:00Z",
    },
    {
      id: "3",
      userId: "3",
      userName: "Bob Johnson",
      userImage: "/diverse-group-outdoors.png",
      content: "I've heard South Beach is nice, but it can be crowded. Maybe we should look at Mid-Beach?",
      createdAt: "2025-05-11T09:15:00Z",
    },
  ],
}

export default function TripDetailsPage() {
  const params = useParams()
  const tripId = params.id as string
  const [trip, setTrip] = useState(tripData)
  const [activeTab, setActiveTab] = useState("availability")

  // In a real app, you would fetch the trip data from the API
  useEffect(() => {
    // Fetch trip data
    console.log("Fetching trip data for ID:", tripId)
  }, [tripId])

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const startDate = formatDate(trip.startDate)
  const endDate = formatDate(trip.endDate)

  return (
    <div className="container py-10">
      <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden">
        <Image src={trip.image || "/placeholder.svg"} alt={trip.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{trip.name}</h1>
              <p className="text-white/80 flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {trip.destination}
              </p>
            </div>
            <Badge className="bg-emerald-600 hover:bg-emerald-700">
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 mb-6">
        <InfoCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <AlertDescription className="text-emerald-700 dark:text-emerald-300">
          <p className="font-medium">
            Trip Planning Status: {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </p>
          <p className="text-sm mt-1">
            The dates shown below are tentative. Add your availability in the "Availability" tab to help find the best
            dates for everyone. Once all participants have added their availability, the group can finalize the dates.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Information about this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{trip.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tentative Dates</p>
                      <p className="text-sm text-muted-foreground">
                        {startDate} - {endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Group</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.group.name} ({trip.participants.length} participants)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-sm text-muted-foreground">
                        Total: ${trip.budget}, Per Person: ${trip.perPersonBudget}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground capitalize">{trip.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Group Availability</CardTitle>
                  <CardDescription>
                    See when everyone is available and find the best dates for your trip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AvailabilityCalendar tripId={tripId} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="options">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Options</CardTitle>
                  <CardDescription>Vote on flights, accommodations, and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <TripOptions tripId={tripId} options={trip.options} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discussion">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion</CardTitle>
                  <CardDescription>Chat with your group about the trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <TripDiscussion tripId={tripId} comments={trip.comments} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                  <CardDescription>People joining this trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <TripParticipants tripId={tripId} participants={trip.participants} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Add Availability</Button>
              <Button variant="outline" className="w-full">
                Invite Friends
              </Button>
              <Button variant="outline" className="w-full">
                Edit Trip
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={participant.image || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">
                View All Participants
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-emerald-600" />
                      <p className="text-sm font-medium">July 15 - July 22, 2025</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"
                    >
                      Best Match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">4/4 participants available</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <p className="text-sm font-medium">July 22 - July 29, 2025</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">3/4 participants available</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <p className="text-sm font-medium">August 5 - August 12, 2025</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">3/4 participants available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
