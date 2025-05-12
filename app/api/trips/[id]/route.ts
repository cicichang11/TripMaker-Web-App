import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getTripById, getTripParticipants } from "@/lib/trip-db"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tripId = params.id
    const trip = await getTripById(tripId)

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    // Get trip participants
    const participants = await getTripParticipants(tripId)

    // Check if user is a participant
    const isParticipant = participants.some((p: any) => p.userId === session.user.id)

    if (!isParticipant) {
      return NextResponse.json({ message: "You don't have access to this trip" }, { status: 403 })
    }

    // Get group info if it's a group trip
    let group = null
    if (trip.groupId) {
      const [groupData] = await sql`
        SELECT g.*, COUNT(gm.id) as memberCount
        FROM "Group" g
        LEFT JOIN "GroupMember" gm ON g.id = gm.groupId
        WHERE g.id = ${trip.groupId}
        GROUP BY g.id
      `
      group = groupData
    }

    // Get trip options
    const options = {
      flights: [],
      hotels: [],
      activities: [],
    }

    const tripOptions = await sql`
      SELECT to.*, COUNT(v.id) as voteCount
      FROM "TripOption" to
      LEFT JOIN "Vote" v ON to.id = v.optionId
      WHERE to.tripId = ${tripId}
      GROUP BY to.id
      ORDER BY voteCount DESC
    `

    tripOptions.forEach((option: any) => {
      if (option.type === "flight") {
        options.flights.push(option)
      } else if (option.type === "hotel") {
        options.hotels.push(option)
      } else if (option.type === "activity") {
        options.activities.push(option)
      }
    })

    // Get comments
    const comments = await sql`
      SELECT c.*, u.name as userName, u.image as userImage
      FROM "Comment" c
      JOIN "User" u ON c.userId = u.id
      WHERE c.tripId = ${tripId}
      ORDER BY c.createdAt DESC
    `

    // Get availability data
    const availability = await sql`
      SELECT a.*, u.name as userName, u.image as userImage
      FROM "Availability" a
      JOIN "User" u ON a.userId = u.id
      WHERE a.tripId = ${tripId}
    `

    return NextResponse.json({
      trip,
      participants,
      group,
      options,
      comments,
      availability,
    })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
