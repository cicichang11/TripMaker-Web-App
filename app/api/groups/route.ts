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
      console.log("Database connection test successful in /api/groups")
    } catch (dbTestError) {
      console.error("Database connection test failed in /api/groups:", dbTestError)
      return NextResponse.json(
        {
          message: "Database connection failed",
          error: dbTestError instanceof Error ? dbTestError.message : String(dbTestError),
        },
        { status: 500 },
      )
    }

    // Get groups for the user
    try {
      const groups = await sql`
        SELECT g.*, 
               COUNT(DISTINCT gm.userId) as "memberCount",
               COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'planning') as "upcomingTripsCount"
        FROM "Group" g
        JOIN "GroupMember" gm ON g.id = gm.groupId
        LEFT JOIN "Trip" t ON g.id = t.groupId
        WHERE gm.userId = ${session.user.id}
        GROUP BY g.id
        ORDER BY g.name
      `
      return NextResponse.json({ groups: groups || [] })
    } catch (queryError) {
      console.error("Error querying groups:", queryError)
      return NextResponse.json(
        {
          message: "Error querying groups",
          error: queryError instanceof Error ? queryError.message : String(queryError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("GET /api/groups error:", error)
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

    const { name, description, isPermanent } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Group name is required" }, { status: 400 })
    }

    // Generate a UUID for the new group
    const id = uuidv4()
    const now = new Date()

    // Create the group
    try {
      const [group] = await sql`
        INSERT INTO "Group" (id, name, description, isPermanent, creatorId, createdAt, updatedAt)
        VALUES (${id}, ${name}, ${description || null}, ${isPermanent ?? true}, ${session.user.id}, ${now}, ${now})
        RETURNING *
      `

      // Add the creator as a member with the admin role
      const memberId = uuidv4()
      await sql`
        INSERT INTO "GroupMember" (id, groupId, userId, role, joinedAt)
        VALUES (${memberId}, ${id}, ${session.user.id}, 'admin', ${now})
      `

      return NextResponse.json({ message: "Group created successfully", group }, { status: 201 })
    } catch (queryError) {
      console.error("Error creating group:", queryError)
      return NextResponse.json(
        {
          message: "Error creating group",
          error: queryError instanceof Error ? queryError.message : String(queryError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
