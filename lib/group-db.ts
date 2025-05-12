import { sql } from "./db"
import { v4 as uuidv4 } from "uuid"

export async function getGroupsForUser(userId: string) {
  const groups = await sql`
    SELECT g.* FROM "Group" g
    JOIN "GroupMember" gm ON g.id = gm.groupId
    WHERE gm.userId = ${userId}
    ORDER BY g.name
  `
  return groups
}

export async function getGroupById(groupId: string) {
  const [group] = await sql`
    SELECT * FROM "Group" WHERE id = ${groupId}
  `
  return group
}

export async function createGroup({
  name,
  description,
  isPermanent,
  creatorId,
}: {
  name: string
  description?: string
  isPermanent?: boolean
  creatorId: string
}) {
  const id = uuidv4()
  const now = new Date()

  // Create the group
  const [group] = await sql`
    INSERT INTO "Group" (id, name, description, isPermanent, creatorId, createdAt, updatedAt)
    VALUES (${id}, ${name}, ${description}, ${isPermanent ?? true}, ${creatorId}, ${now}, ${now})
    RETURNING *
  `

  // Add the creator as a member with the admin role
  await sql`
    INSERT INTO "GroupMember" (id, groupId, userId, role, joinedAt)
    VALUES (${uuidv4()}, ${id}, ${creatorId}, 'admin', ${now})
  `

  return group
}

export async function getGroupMembers(groupId: string) {
  const members = await sql`
    SELECT gm.*, u.name, u.email, u.image
    FROM "GroupMember" gm
    JOIN "User" u ON gm.userId = u.id
    WHERE gm.groupId = ${groupId}
  `
  return members
}

export async function addGroupMember(groupId: string, userId: string, role = "member") {
  const id = uuidv4()
  const now = new Date()

  const [member] = await sql`
    INSERT INTO "GroupMember" (id, groupId, userId, role, joinedAt)
    VALUES (${id}, ${groupId}, ${userId}, ${role}, ${now})
    RETURNING *
  `

  return member
}
