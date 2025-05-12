import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/db"

export async function GET() {
  const result = await testDatabaseConnection()

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result.timestamp,
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: result.error,
        connectionString: result.connectionString,
      },
      { status: 500 },
    )
  }
}
