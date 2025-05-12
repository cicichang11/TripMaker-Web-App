"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TripCard } from "@/components/dashboard/trip-card"
import { GroupCard } from "@/components/dashboard/group-card"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  status: string
  isGroupTrip: boolean
  groupName?: string
  participants: number
  image?: string
}

interface Group {
  id: string
  name: string
  members: number
  upcomingTrips: number
  isPermanent: boolean
  image?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([])
  const [pastTrips, setPastTrips] = useState<Trip[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch trips
      const tripsResponse = await fetch("/api/trips")
      const tripsData = await tripsResponse.json()

      if (tripsData.trips) {
        const upcoming: Trip[] = []
        const past: Trip[] = []

        tripsData.trips.forEach((trip: any) => {
          const tripData = {
            id: trip.id,
            name: trip.name,
            destination: trip.destination || "No destination",
            startDate: trip.startDate,
            endDate: trip.endDate,
            status: trip.status,
            isGroupTrip: !!trip.groupId,
            groupName: trip.groupName,
            participants: trip.participants || 1,
            image: `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(trip.destination || trip.name)}`,
          }

          if (trip.status === "completed") {
            past.push(tripData)
          } else {
            upcoming.push(tripData)
          }
        })

        setUpcomingTrips(upcoming)
        setPastTrips(past)
      }

      // Fetch groups
      const groupsResponse = await fetch("/api/groups")
      const groupsData = await groupsResponse.json()

      if (groupsData.groups) {
        const groupsWithData = groupsData.groups.map((group: any) => ({
          id: group.id,
          name: group.name,
          members: group.memberCount || 1,
          upcomingTrips: group.upcomingTripsCount || 0,
          isPermanent: group.isPermanent,
          image: `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(group.name)}`,
        }))

        setGroups(groupsWithData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader heading="Dashboard" text="Welcome back! Manage your trips and groups." />

        <Tabs defaultValue="trips" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="groups">My Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="trips" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingTrips.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Past Trips</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pastTrips.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Groups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{groups.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actions</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Link href="/trips/new">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">New Trip</Button>
                  </Link>
                  <Link href="/groups/new">
                    <Button variant="outline" className="w-full">
                      New Group
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Upcoming Trips</h2>
                <Link href="/trips">
                  <Button variant="link">View all</Button>
                </Link>
              </div>
              {upcomingTrips.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <EmptyPlaceholder
                  title="No upcoming trips"
                  description="You don't have any upcoming trips. Create a new trip to get started."
                  buttonText="Create Trip"
                  buttonLink="/trips/new"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Past Trips</h2>
                <Link href="/trips?filter=past">
                  <Button variant="link">View all</Button>
                </Link>
              </div>
              {pastTrips.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <EmptyPlaceholder
                  title="No past trips"
                  description="You don't have any past trips yet."
                  buttonText="Create Trip"
                  buttonLink="/trips/new"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">My Groups</h2>
              <Link href="/groups/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </Link>
            </div>
            {groups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <EmptyPlaceholder
                title="No groups"
                description="You don't have any groups yet. Create a new group to get started."
                buttonText="Create Group"
                buttonLink="/groups/new"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
