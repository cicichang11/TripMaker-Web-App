import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth-db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const user = await createUser({ name, email, password })

    // Remove password from response
    return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
