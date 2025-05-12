import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tripId = params.id
    const { content } = await request.json()

    // Validate input
    if (!content) {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 })
    }

    // Check if user is a participant in the trip
    const [participant] = await sql`
      SELECT * FROM "TripParticipant"
      WHERE tripId = ${tripId} AND userId = ${session.user.id}
    `

    if (!participant) {
      return NextResponse.json({ message: "You are not a participant in this trip" }, { status: 403 })
    }

    const now = new Date()
    const id = uuidv4()

    // Create new comment
    await sql`
      INSERT INTO "Comment" (id, tripId, userId, content, createdAt, updatedAt)
      VALUES (${id}, ${tripId}, ${session.user.id}, ${content}, ${now}, ${now})
    `

    // Get the created comment with user info
    const [comment] = await sql`
      SELECT c.*, u.name as userName, u.image as userImage
      FROM "Comment" c
      JOIN "User" u ON c.userId = u.id
      WHERE c.id = ${id}
    `

    return NextResponse.json({ message: "Comment added successfully", comment })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tripId = params.id

    // Check if user is a participant in the trip
    const [participant] = await sql`
      SELECT * FROM "TripParticipant"
      WHERE tripId = ${tripId} AND userId = ${session.user.id}
    `

    if (!participant) {
      return NextResponse.json({ message: "You are not a participant in this trip" }, { status: 403 })
    }

    // Get all comments for the trip
    const comments = await sql`
      SELECT c.*, u.name as userName, u.image as userImage
      FROM "Comment" c
      JOIN "User" u ON c.userId = u.id
      WHERE c.tripId = ${tripId}
      ORDER BY c.createdAt DESC
    `

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
