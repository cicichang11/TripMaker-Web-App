import { sql } from "./db"
import { v4 as uuidv4 } from "uuid"

export async function getTripsForUser(userId: string) {
  const trips = await sql`
    SELECT t.* FROM "Trip" t
    JOIN "TripParticipant" tp ON t.id = tp.tripId
    WHERE tp.userId = ${userId}
    ORDER BY t.startDate DESC NULLS LAST
  `
  return trips
}

export async function getTripById(tripId: string) {
  const [trip] = await sql`
    SELECT * FROM "Trip" WHERE id = ${tripId}
  `
  return trip
}

export async function createTrip({
  name,
  description,
  destination,
  startDate,
  endDate,
  budget,
  perPersonBudget,
  creatorId,
  groupId,
}: {
  name: string
  description?: string
  destination?: string
  startDate?: Date
  endDate?: Date
  budget?: number
  perPersonBudget?: number
  creatorId: string
  groupId?: string
}) {
  const id = uuidv4()
  const now = new Date()

  // Create the trip
  const [trip] = await sql`
    INSERT INTO "Trip" (
      id, name, description, destination, startDate, endDate, 
      budget, perPersonBudget, creatorId, groupId, createdAt, updatedAt
    )
    VALUES (
      ${id}, ${name}, ${description}, ${destination}, ${startDate}, ${endDate},
      ${budget}, ${perPersonBudget}, ${creatorId}, ${groupId}, ${now}, ${now}
    )
    RETURNING *
  `

  // Add the creator as a participant with the organizer role
  await sql`
    INSERT INTO "TripParticipant" (id, tripId, userId, role, joinedAt)
    VALUES (${uuidv4()}, ${id}, ${creatorId}, 'organizer', ${now})
  `

  return trip
}

export async function getTripParticipants(tripId: string) {
  const participants = await sql`
    SELECT tp.*, u.name, u.email, u.image
    FROM "TripParticipant" tp
    JOIN "User" u ON tp.userId = u.id
    WHERE tp.tripId = ${tripId}
  `
  return participants
}

export async function addTripParticipant(tripId: string, userId: string, role = "participant") {
  const id = uuidv4()
  const now = new Date()

  const [participant] = await sql`
    INSERT INTO "TripParticipant" (id, tripId, userId, role, joinedAt)
    VALUES (${id}, ${tripId}, ${userId}, ${role}, ${now})
    RETURNING *
  `

  return participant
}
