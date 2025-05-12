"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { GroupSelector } from "@/components/trips/group-selector"
import { BudgetSelector } from "@/components/trips/budget-selector"
import { DestinationSelector } from "@/components/trips/destination-selector"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define types for better type safety
interface Group {
  id: string
  name: string
  members: number
}

interface Budget {
  total: number
  perPerson: number
}

export default function NewTripPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get groupId from URL if provided
  const groupIdParam = searchParams?.get("groupId")

  // State for fetching groups
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)

  // Form state with proper typings
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [groupId, setGroupId] = useState(groupIdParam || "")
  const [isNewGroup, setIsNewGroup] = useState(!groupIdParam)
  const [newGroupName, setNewGroupName] = useState("")
  const [budget, setBudget] = useState<Budget>({ total: 1000, perPerson: 250 })

  // UI state
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Memoize the fetch function to prevent recreation on each render
  const fetchGroups = useCallback(async () => {
    if (status !== "authenticated") return

    try {
      setIsLoadingGroups(true)
      const response = await fetch("/api/groups")

      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`)
      }

      const data = await response.json()

      if (data.groups && Array.isArray(data.groups)) {
        // Map the response to our Group type
        const formattedGroups: Group[] = data.groups.map((group: any) => ({
          id: group.id,
          name: group.name,
          members: group.memberCount || 1,
        }))
        setGroups(formattedGroups)
      } else {
        // If no groups or invalid format, set empty array
        setGroups([])
      }
    } catch (error) {
      console.error("Error fetching groups:", error)
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      })
      // Set empty array on error to prevent undefined groups
      setGroups([])
    } finally {
      setIsLoadingGroups(false)
    }
  }, [status, toast])

  // Fetch groups only when component mounts and status changes
  useEffect(() => {
    if (status === "authenticated") {
      fetchGroups()
    }
  }, [fetchGroups, status])

  // Handle redirect for unauthenticated users
  if (status === "unauthenticated") {
    redirect("/auth/login")
  }

  // Handle loading state
  if (status === "loading" || isLoadingGroups) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // Callback handlers
  const handleGroupTypeChange = (value: string) => {
    setIsNewGroup(value === "new")
    if (value === "new") {
      setGroupId("")
    }
  }

  const handleGroupSelect = (id: string) => {
    if (id) setGroupId(id)
  }

  const handleBudgetChange = (newBudget: Budget) => {
    setBudget(newBudget)
  }

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest)
  }

  const createGroup = async (name: string) => {
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: `Group for ${name} trip`,
          isPermanent: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create group")
      }

      const data = await response.json()
      return data.group.id
    } catch (error) {
      console.error("Error creating group:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      if (!name) {
        toast({
          title: "Error",
          description: "Trip name is required",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // If creating a new group, create it first
      let finalGroupId = groupId
      if (isNewGroup && newGroupName) {
        try {
          finalGroupId = await createGroup(newGroupName)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create group. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      // Prepare the data to send
      const tripData = {
        name,
        description,
        destination,
        startDate,
        endDate,
        budget: budget.total,
        perPersonBudget: budget.perPerson,
        groupId: isNewGroup ? finalGroupId : groupId || null,
      }

      // Send the request
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create trip")
      }

      toast({
        title: "Success",
        description: "Trip created successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating trip:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trip",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Trip</h1>
        <p className="text-muted-foreground">Plan your next adventure with friends and family</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>Fill in the details for your new trip</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-trip-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Trip Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Summer Vacation 2025"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your trip"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Destination</Label>
                  <DestinationSelector onSelect={handleDestinationSelect} />
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <InfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    TripMaker helps you find the best dates for your trip based on everyone's availability. You can set
                    tentative dates now or leave them blank and determine the final dates after collecting availability
                    from all participants.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-2">
                  <Label className="flex items-center">
                    <span>Tentative Dates (Optional)</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      These can be changed later based on group availability
                    </span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Group Selection</Label>
                  <Tabs defaultValue={isNewGroup ? "new" : "existing"} onValueChange={handleGroupTypeChange}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="existing">Existing Group</TabsTrigger>
                      <TabsTrigger value="new">New Group</TabsTrigger>
                    </TabsList>
                    <TabsContent value="existing">
                      <div className="mt-4 space-y-4">
                        <GroupSelector groups={groups} selectedGroupId={groupId} onSelect={handleGroupSelect} />
                      </div>
                    </TabsContent>
                    <TabsContent value="new">
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="newGroupName">New Group Name</Label>
                          <Input
                            id="newGroupName"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Summer 2025 Trip Group"
                            required={isNewGroup}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You'll be able to invite members after creating the trip.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Budget Planning</Label>
                  <BudgetSelector onChange={handleBudgetChange} />
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Trip Summary</h3>
                  <div className="rounded-md bg-muted p-4">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Trip Name:</dt>
                        <dd>{name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Destination:</dt>
                        <dd>{destination || "Not specified"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Tentative Dates:</dt>
                        <dd>
                          {startDate ? startDate.toLocaleDateString() : "To be determined"} -{" "}
                          {endDate ? endDate.toLocaleDateString() : "To be determined"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Group:</dt>
                        <dd>
                          {isNewGroup
                            ? newGroupName || "New group"
                            : groups.find((g) => g.id === groupId)?.name || "Not selected"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Budget:</dt>
                        <dd>
                          Total: ${budget.total}, Per Person: ${budget.perPerson}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                  <InfoCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                    <p className="font-medium mb-1">Next Steps After Creating Your Trip:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Invite group members to join your trip</li>
                      <li>Everyone will input their availability</li>
                      <li>TripMaker will suggest optimal date ranges based on availability</li>
                      <li>Your group can vote on the final dates and details</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" className="bg-emerald-600 hover:bg-emerald-700" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              form="new-trip-form"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Trip"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
