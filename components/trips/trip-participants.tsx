"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TripParticipantsProps {
  tripId: string
  participants: Array<{
    id: string
    name: string
    email: string
    image: string
    role: string
  }>
}

export function TripParticipants({ tripId, participants }: TripParticipantsProps) {
  return (
    <div className="space-y-4">
      {participants.map((participant) => (
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
  )
}
