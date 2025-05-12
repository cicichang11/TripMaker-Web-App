import { sql } from "./db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function getUserByEmail(email: string) {
  try {
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (!users || users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw new Error("Database error when fetching user")
  }
}

export async function getUserById(id: string) {
  try {
    const users = await sql`
      SELECT * FROM "User" WHERE id = ${id}
    `

    if (!users || users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw new Error("Database error when fetching user")
  }
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    const users = await sql`
      INSERT INTO "User" (id, name, email, password)
      VALUES (${id}, ${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    if (!users || users.length === 0) {
      throw new Error("Failed to create user")
    }

    return users[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Database error when creating user")
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    throw new Error("Error verifying password")
  }
}
