"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function NewGroupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPermanent, setIsPermanent] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  if (status === "unauthenticated") {
    redirect("/auth/login")
  }

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!name) {
        toast({
          title: "Error",
          description: "Group name is required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          isPermanent,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create group")
      }

      toast({
        title: "Success",
        description: "Group created successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating group:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create group",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Group</h1>
        <p className="text-muted-foreground">Create a group to plan trips with friends and family</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
          <CardDescription>Fill in the details for your new group</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-group-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Family Trip Group"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your group"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isPermanent" checked={isPermanent} onCheckedChange={setIsPermanent} />
                <Label htmlFor="isPermanent">Permanent Group</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {isPermanent
                  ? "Permanent groups can be used for multiple trips."
                  : "Temporary groups are intended for a single trip."}
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-group-form"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Group"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
