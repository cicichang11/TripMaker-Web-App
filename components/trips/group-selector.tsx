"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

interface Group {
  id: string
  name: string
  members?: number
}

interface GroupSelectorProps {
  groups: Group[]
  selectedGroupId: string
  onSelect: (groupId: string) => void
}

export function GroupSelector({ groups, selectedGroupId, onSelect }: GroupSelectorProps) {
  // Safely handle groups that might be undefined or not an array
  const hasGroups = Array.isArray(groups) && groups.length > 0

  if (!hasGroups) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">You don't have any groups yet. Create a new group instead.</p>
      </div>
    )
  }

  return (
    <RadioGroup value={selectedGroupId} onValueChange={onSelect}>
      <div className="space-y-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer ${
              selectedGroupId === group.id ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : ""
            }`}
            onClick={() => onSelect(group.id)}
          >
            <RadioGroupItem value={group.id} id={`group-${group.id}`} className="sr-only" />
            <Avatar className="h-10 w-10">
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor={`group-${group.id}`} className="text-base font-medium cursor-pointer">
                {group.name}
              </Label>
              <p className="text-sm text-muted-foreground flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {group.members || 1} {(group.members || 1) === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}
