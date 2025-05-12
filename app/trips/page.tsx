"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/dashboard/trip-card"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TripsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchTrips()
    }
  }, [status])

  const fetchTrips = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/trips")

      if (!response.ok) {
        throw new Error(`Failed to fetch trips: ${response.status}`)
      }

      const data = await response.json()

      if (data.trips) {
        const formattedTrips = data.trips.map((trip: any) => ({
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
        }))
        setTrips(formattedTrips)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast({
        title: "Error",
        description: "Failed to load trips. Please try again.",
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
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Manage all your trips in one place</p>
        </div>
        <Link href="/trips/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {trips.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip: any) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder
          title="No trips found"
          description="You haven't created any trips yet. Create your first trip to get started."
          buttonText="Create Trip"
          buttonLink="/trips/new"
        />
      )}
    </div>
  )
}
