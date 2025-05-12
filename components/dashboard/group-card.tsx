import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface GroupCardProps {
  group: {
    id: string
    name: string
    members: number
    image: string
    upcomingTrips: number
    isPermanent: boolean
  }
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={group.image || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                {group.members} {group.members === 1 ? "member" : "members"}
              </CardDescription>
            </div>
          </div>
          {group.isPermanent ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Permanent
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              Temporary
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-1" />
          {group.upcomingTrips} upcoming {group.upcomingTrips === 1 ? "trip" : "trips"}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/groups/${group.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Group
          </Button>
        </Link>
        <Link href={`/trips/new?groupId=${group.id}`} className="flex-1">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Plan Trip</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
