import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TripCardProps {
  trip: {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string
    image: string
    isGroupTrip: boolean
    groupName?: string
    participants: number
  }
}

export function TripCard({ trip }: TripCardProps) {
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const startDate = formatDate(trip.startDate)
  const endDate = formatDate(trip.endDate)

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={trip.image || "/placeholder.svg"} alt={trip.name} fill className="object-cover" />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{trip.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {trip.destination}
            </CardDescription>
          </div>
          {trip.isGroupTrip && (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            >
              Group Trip
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-1" />
          {startDate} - {endDate}
        </div>
        {trip.isGroupTrip && trip.groupName && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {trip.groupName} ({trip.participants} {trip.participants === 1 ? "person" : "people"})
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/trips/${trip.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
