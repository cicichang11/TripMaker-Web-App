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
    const { startDate, endDate } = await request.json()

    // Validate input
    if (!startDate || !endDate) {
      return NextResponse.json({ message: "Start date and end date are required" }, { status: 400 })
    }

    // Check if user is a participant in the trip
    const [participant] = await sql`
      SELECT * FROM "TripParticipant"
      WHERE tripId = ${tripId} AND userId = ${session.user.id}
    `

    if (!participant) {
      return NextResponse.json({ message: "You are not a participant in this trip" }, { status: 403 })
    }

    // Check if user already has availability for this trip
    const existingAvailability = await sql`
      SELECT * FROM "Availability"
      WHERE tripId = ${tripId} AND userId = ${session.user.id}
    `

    const now = new Date()
    const id = uuidv4()

    if (existingAvailability.length > 0) {
      // Update existing availability
      await sql`
        UPDATE "Availability"
        SET startDate = ${new Date(startDate)}, endDate = ${new Date(endDate)}, updatedAt = ${now}
        WHERE tripId = ${tripId} AND userId = ${session.user.id}
      `
    } else {
      // Create new availability
      await sql`
        INSERT INTO "Availability" (id, tripId, userId, startDate, endDate, createdAt, updatedAt)
        VALUES (${id}, ${tripId}, ${session.user.id}, ${new Date(startDate)}, ${new Date(endDate)}, ${now}, ${now})
      `
    }

    return NextResponse.json({ message: "Availability saved successfully" })
  } catch (error) {
    console.error("Error saving availability:", error)
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

    // Get all availability data for the trip
    const availability = await sql`
      SELECT a.*, u.name as userName, u.image as userImage
      FROM "Availability" a
      JOIN "User" u ON a.userId = u.id
      WHERE a.tripId = ${tripId}
    `

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
