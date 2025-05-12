import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Create a SQL client with the connection string
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set")
}

// Create a single SQL client instance
let sqlClient: NeonQueryFunction<any, any> | null = null

try {
  if (connectionString) {
    sqlClient = neon(connectionString)
    console.log("Database client initialized successfully")
  }
} catch (error) {
  console.error("Failed to initialize Neon SQL client:", error)
}

// Export the sql client directly
export const sql =
  sqlClient ||
  ((strings: any, ...values: any[]) => {
    throw new Error("Database connection not available. Check DATABASE_URL environment variable.")
  })

// Function to test the database connection
export async function testDatabaseConnection() {
  try {
    if (!connectionString) {
      return {
        success: false,
        error: "DATABASE_URL environment variable is not set",
        connectionString: "Not set",
      }
    }

    // Create a fresh client for testing
    const testClient = neon(connectionString)
    const result = await testClient`SELECT NOW()`

    console.log("Database connection test successful:", result)
    return {
      success: true,
      timestamp: result[0]?.now,
      message: "Connected to database successfully",
    }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      connectionString: connectionString ? "Set (masked for security)" : "Not set",
    }
  }
}
