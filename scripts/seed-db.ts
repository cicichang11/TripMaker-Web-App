import { sql } from "../lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

async function seed() {
  try {
    console.log("Seeding database...")

    // Create users
    const users = [
      {
        id: uuidv4(),
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        image: "/diverse-person.png",
      },
      {
        id: uuidv4(),
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        image: "/diverse-group-two.png",
      },
      {
        id: uuidv4(),
        name: "Bob Johnson",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
        image: "/diverse-group-outdoors.png",
      },
      {
        id: uuidv4(),
        name: "Alice Williams",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
        image: "/diverse-group-four.png",
      },
    ]

    for (const user of users) {
      await sql`
        INSERT INTO "User" (id, name, email, password, image)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.image})
        ON CONFLICT (email) DO NOTHING
      `
    }
    console.log(`Created ${users.length} users`)

    // Create groups
    const groups = [
      {
        id: uuidv4(),
        name: "College Friends",
        description: "Friends from college days",
        isPermanent: true,
        creatorId: users[0].id,
      },
      {
        id: uuidv4(),
        name: "Family",
        description: "Family members",
        isPermanent: true,
        creatorId: users[1].id,
      },
      {
        id: uuidv4(),
        name: "Hiking Club",
        description: "Group for hiking enthusiasts",
        isPermanent: true,
        creatorId: users[2].id,
      },
      {
        id: uuidv4(),
        name: "Work Team",
        description: "Colleagues from work",
        isPermanent: false,
        creatorId: users[3].id,
      },
    ]

    const now = new Date()
    for (const group of groups) {
      await sql`
        INSERT INTO "Group" (id, name, description, isPermanent, creatorId, createdAt, updatedAt)
        VALUES (${group.id}, ${group.name}, ${group.description}, ${group.isPermanent}, ${group.creatorId}, ${now}, ${now})
        ON CONFLICT (id) DO NOTHING
      `
    }
    console.log(`Created ${groups.length} groups`)

    // Add group members
    const groupMembers = [
      // College Friends group
      { id: uuidv4(), groupId: groups[0].id, userId: users[0].id, role: "admin" },
      { id: uuidv4(), groupId: groups[0].id, userId: users[1].id, role: "member" },
      { id: uuidv4(), groupId: groups[0].id, userId: users[2].id, role: "member" },

      // Family group
      { id: uuidv4(), groupId: groups[1].id, userId: users[1].id, role: "admin" },
      { id: uuidv4(), groupId: groups[1].id, userId: users[0].id, role: "member" },
      { id: uuidv4(), groupId: groups[1].id, userId: users[3].id, role: "member" },

      // Hiking Club group
      { id: uuidv4(), groupId: groups[2].id, userId: users[2].id, role: "admin" },
      { id: uuidv4(), groupId: groups[2].id, userId: users[0].id, role: "member" },
      { id: uuidv4(), groupId: groups[2].id, userId: users[1].id, role: "member" },
      { id: uuidv4(), groupId: groups[2].id, userId: users[3].id, role: "member" },

      // Work Team group
      { id: uuidv4(), groupId: groups[3].id, userId: users[3].id, role: "admin" },
      { id: uuidv4(), groupId: groups[3].id, userId: users[0].id, role: "member" },
      { id: uuidv4(), groupId: groups[3].id, userId: users[1].id, role: "member" },
    ]

    for (const member of groupMembers) {
      await sql`
        INSERT INTO "GroupMember" (id, groupId, userId, role, joinedAt)
        VALUES (${member.id}, ${member.groupId}, ${member.userId}, ${member.role}, ${now})
        ON CONFLICT (groupId, userId) DO NOTHING
      `
    }
    console.log(`Added ${groupMembers.length} group members`)

    // Create trips
    const trips = [
      {
        id: uuidv4(),
        name: "Summer Beach Vacation",
        description: "A relaxing week at the beach with friends",
        destination: "Miami, FL",
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-22"),
        status: "planning",
        budget: 5000,
        perPersonBudget: 1250,
        creatorId: users[0].id,
        groupId: groups[0].id,
      },
      {
        id: uuidv4(),
        name: "Mountain Hiking Trip",
        description: "Exploring the beautiful mountains",
        destination: "Denver, CO",
        startDate: new Date("2025-08-10"),
        endDate: new Date("2025-08-15"),
        status: "planning",
        budget: 3000,
        perPersonBudget: 750,
        creatorId: users[2].id,
        groupId: groups[2].id,
      },
      {
        id: uuidv4(),
        name: "Business Conference",
        description: "Annual industry conference",
        destination: "New York, NY",
        startDate: new Date("2025-09-05"),
        endDate: new Date("2025-09-07"),
        status: "planning",
        budget: 1500,
        perPersonBudget: 1500,
        creatorId: users[3].id,
        groupId: null,
      },
      {
        id: uuidv4(),
        name: "European Adventure",
        description: "Exploring Europe with family",
        destination: "Paris, France",
        startDate: new Date("2024-03-10"),
        endDate: new Date("2024-03-20"),
        status: "completed",
        budget: 8000,
        perPersonBudget: 2000,
        creatorId: users[1].id,
        groupId: groups[1].id,
      },
      {
        id: uuidv4(),
        name: "Weekend Getaway",
        description: "Quick weekend trip",
        destination: "Las Vegas, NV",
        startDate: new Date("2024-02-15"),
        endDate: new Date("2024-02-17"),
        status: "completed",
        budget: 2000,
        perPersonBudget: 500,
        creatorId: users[0].id,
        groupId: groups[0].id,
      },
    ]

    for (const trip of trips) {
      await sql`
        INSERT INTO "Trip" (
          id, name, description, destination, startDate, endDate, 
          status, budget, perPersonBudget, creatorId, groupId, createdAt, updatedAt
        )
        VALUES (
          ${trip.id}, ${trip.name}, ${trip.description}, ${trip.destination}, 
          ${trip.startDate}, ${trip.endDate}, ${trip.status}, ${trip.budget}, 
          ${trip.perPersonBudget}, ${trip.creatorId}, ${trip.groupId}, ${now}, ${now}
        )
        ON CONFLICT (id) DO NOTHING
      `
    }
    console.log(`Created ${trips.length} trips`)

    // Add trip participants
    const tripParticipants = [
      // Summer Beach Vacation
      { id: uuidv4(), tripId: trips[0].id, userId: users[0].id, role: "organizer" },
      { id: uuidv4(), tripId: trips[0].id, userId: users[1].id, role: "participant" },
      { id: uuidv4(), tripId: trips[0].id, userId: users[2].id, role: "participant" },

      // Mountain Hiking Trip
      { id: uuidv4(), tripId: trips[1].id, userId: users[2].id, role: "organizer" },
      { id: uuidv4(), tripId: trips[1].id, userId: users[0].id, role: "participant" },
      { id: uuidv4(), tripId: trips[1].id, userId: users[1].id, role: "participant" },
      { id: uuidv4(), tripId: trips[1].id, userId: users[3].id, role: "participant" },

      // Business Conference
      { id: uuidv4(), tripId: trips[2].id, userId: users[3].id, role: "organizer" },

      // European Adventure
      { id: uuidv4(), tripId: trips[3].id, userId: users[1].id, role: "organizer" },
      { id: uuidv4(), tripId: trips[3].id, userId: users[0].id, role: "participant" },
      { id: uuidv4(), tripId: trips[3].id, userId: users[3].id, role: "participant" },

      // Weekend Getaway
      { id: uuidv4(), tripId: trips[4].id, userId: users[0].id, role: "organizer" },
      { id: uuidv4(), tripId: trips[4].id, userId: users[1].id, role: "participant" },
      { id: uuidv4(), tripId: trips[4].id, userId: users[2].id, role: "participant" },
    ]

    for (const participant of tripParticipants) {
      await sql`
        INSERT INTO "TripParticipant" (id, tripId, userId, role, joinedAt)
        VALUES (${participant.id}, ${participant.tripId}, ${participant.userId}, ${participant.role}, ${now})
        ON CONFLICT (tripId, userId) DO NOTHING
      `
    }
    console.log(`Added ${tripParticipants.length} trip participants`)

    // Add availability data
    const availabilityData = [
      // Summer Beach Vacation
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[0].id,
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-25"),
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[1].id,
        startDate: new Date("2025-07-10"),
        endDate: new Date("2025-07-20"),
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[2].id,
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-22"),
      },

      // Mountain Hiking Trip
      {
        id: uuidv4(),
        tripId: trips[1].id,
        userId: users[2].id,
        startDate: new Date("2025-08-05"),
        endDate: new Date("2025-08-20"),
      },
      {
        id: uuidv4(),
        tripId: trips[1].id,
        userId: users[0].id,
        startDate: new Date("2025-08-10"),
        endDate: new Date("2025-08-17"),
      },
      {
        id: uuidv4(),
        tripId: trips[1].id,
        userId: users[1].id,
        startDate: new Date("2025-08-12"),
        endDate: new Date("2025-08-19"),
      },
    ]

    for (const availability of availabilityData) {
      await sql`
        INSERT INTO "Availability" (id, tripId, userId, startDate, endDate, createdAt, updatedAt)
        VALUES (
          ${availability.id}, ${availability.tripId}, ${availability.userId}, 
          ${availability.startDate}, ${availability.endDate}, ${now}, ${now}
        )
        ON CONFLICT (id) DO NOTHING
      `
    }
    console.log(`Added ${availabilityData.length} availability records`)

    // Add trip options
    const tripOptions = [
      // Summer Beach Vacation - Flights
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "flight",
        title: "American Airlines",
        description: "Round trip from JFK to MIA",
        price: 350,
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "flight",
        title: "Delta Airlines",
        description: "Round trip from LGA to MIA",
        price: 320,
      },

      // Summer Beach Vacation - Hotels
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "hotel",
        title: "Beachfront Resort",
        description: "4-star hotel with ocean view",
        price: 1200,
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "hotel",
        title: "Downtown Hotel",
        description: "3-star hotel in the city center",
        price: 800,
      },

      // Summer Beach Vacation - Activities
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "activity",
        title: "Jet Skiing",
        description: "2-hour jet ski rental",
        price: 120,
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        type: "activity",
        title: "Snorkeling Tour",
        description: "Half-day snorkeling tour",
        price: 80,
      },
    ]

    for (const option of tripOptions) {
      await sql`
        INSERT INTO "TripOption" (
          id, tripId, type, title, description, price, createdAt, updatedAt
        )
        VALUES (
          ${option.id}, ${option.tripId}, ${option.type}, ${option.title}, 
          ${option.description}, ${option.price}, ${now}, ${now}
        )
        ON CONFLICT (id) DO NOTHING
      `
    }
    console.log(`Added ${tripOptions.length} trip options`)

    // Add votes
    const votes = [
      // Votes for American Airlines
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[0].id, userId: users[0].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[0].id, userId: users[1].id, value: 1 },

      // Votes for Delta Airlines
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[1].id, userId: users[2].id, value: 1 },

      // Votes for Beachfront Resort
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[2].id, userId: users[0].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[2].id, userId: users[1].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[2].id, userId: users[2].id, value: 1 },

      // Votes for Jet Skiing
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[4].id, userId: users[0].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[4].id, userId: users[1].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[4].id, userId: users[2].id, value: 1 },

      // Votes for Snorkeling Tour
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[5].id, userId: users[0].id, value: 1 },
      { id: uuidv4(), tripId: trips[0].id, optionId: tripOptions[5].id, userId: users[1].id, value: 1 },
    ]

    for (const vote of votes) {
      await sql`
        INSERT INTO "Vote" (id, tripId, optionId, userId, value, createdAt, updatedAt)
        VALUES (
          ${vote.id}, ${vote.tripId}, ${vote.optionId}, ${vote.userId}, 
          ${vote.value}, ${now}, ${now}
        )
        ON CONFLICT (optionId, userId) DO NOTHING
      `
    }
    console.log(`Added ${votes.length} votes`)

    // Add comments
    const comments = [
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[0].id,
        content: "I'm really excited for this trip! I've been wanting to go to Miami for years.",
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[1].id,
        content: "Me too! Does anyone have preferences for which part of the beach we should stay near?",
      },
      {
        id: uuidv4(),
        tripId: trips[0].id,
        userId: users[2].id,
        content: "I've heard South Beach is nice, but it can be crowded. Maybe we should look at Mid-Beach?",
      },
    ]

    for (const comment of comments) {
      await sql`
        INSERT INTO "Comment" (id, tripId, userId, content, createdAt, updatedAt)
        VALUES (
          ${comment.id}, ${comment.tripId}, ${comment.userId}, 
          ${comment.content}, ${now}, ${now}
        )
        ON CONFLICT (id) DO NOTHING
      `
    }
    console.log(`Added ${comments.length} comments`)

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

seed()
