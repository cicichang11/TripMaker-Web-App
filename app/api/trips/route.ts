import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Test the connection first
    try {
      await sql`SELECT 1`
      console.log("Database connection test successful in /api/trips")
    } catch (dbTestError) {
      console.error("Database connection test failed in /api/trips:", dbTestError)
      return NextResponse.json(
        {
          message: "Database connection failed",
          error: dbTestError instanceof Error ? dbTestError.message : String(dbTestError),
        },
        { status: 500 },
      )
    }

    // Get trips for the user
    try {
      const trips = await sql`
        SELECT t.*, 
               g.name as "groupName", 
               COUNT(tp.id) as "participants"
        FROM "Trip" t
        LEFT JOIN "Group" g ON t.groupId = g.id
        LEFT JOIN "TripParticipant" tp ON t.id = tp.tripId
        WHERE t.creatorId = ${session.user.id} OR tp.userId = ${session.user.id}
        GROUP BY t.id, g.name
        ORDER BY t.createdAt DESC
      `
      return NextResponse.json({ trips })
    } catch (queryError) {
      console.error("Error querying trips:", queryError)
      return NextResponse.json(
        {
          message: "Error querying trips",
          error: queryError instanceof Error ? queryError.message : String(queryError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("GET /api/trips error:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, description, destination, startDate, endDate, budget, perPersonBudget, groupId } =
      await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Trip name is required" }, { status: 400 })
    }

    // Check if groupId is valid when provided
    if (groupId) {
      try {
        const groups = await sql`SELECT id FROM "Group" WHERE id = ${groupId}`
        if (!groups || groups.length === 0) {
          return NextResponse.json({ message: "Invalid group selected" }, { status: 400 })
        }
      } catch (error) {
        console.error("Validating groupId in POST /api/trips:", error)
        return NextResponse.json({ message: "Error validating group" }, { status: 500 })
      }
    }

    const id = uuidv4()
    const now = new Date()

    // Create the trip
    try {
      const [trip] = await sql`
        INSERT INTO "Trip" (
          id, name, description, destination, startDate, endDate, 
          budget, perPersonBudget, creatorId, groupId, createdAt, updatedAt
        )
        VALUES (
          ${id}, ${name}, ${description}, ${destination}, 
          ${startDate ? new Date(startDate) : null}, 
          ${endDate ? new Date(endDate) : null},
          ${budget ? Number(budget) : null}, 
          ${perPersonBudget ? Number(perPersonBudget) : null}, 
          ${session.user.id}, 
          ${groupId || null}, 
          ${now}, ${now}
        )
        RETURNING *
      `

      // Add the creator as a participant with the organizer role
      const participantId = uuidv4()
      await sql`
        INSERT INTO "TripParticipant" (id, tripId, userId, role, joinedAt)
        VALUES (${participantId}, ${id}, ${session.user.id}, 'organizer', ${now})
      `

      return NextResponse.json({ message: "Trip created successfully", trip }, { status: 201 })
    } catch (queryError) {
      console.error("Error creating trip:", queryError)
      return NextResponse.json(
        {
          message: "Error creating trip",
          error: queryError instanceof Error ? queryError.message : String(queryError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("POST /api/trips error:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
