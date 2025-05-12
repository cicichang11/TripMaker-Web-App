import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if essential tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('User', 'Group', 'GroupMember', 'Trip', 'TripParticipant')
    `

    const existingTables = tables.map((t: any) => t.table_name)
    const requiredTables = ["User", "Group", "GroupMember", "Trip", "TripParticipant"]
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    if (missingTables.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Database schema is incomplete",
        missingTables,
        existingTables,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database schema is complete",
      tables: existingTables,
    })
  } catch (error) {
    console.error("Error checking database schema:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error checking database schema",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
