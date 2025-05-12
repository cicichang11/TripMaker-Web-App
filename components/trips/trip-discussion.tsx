"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  userId: string
  userName: string
  userImage: string
  content: string
  createdAt: string
}

interface TripDiscussionProps {
  tripId: string
  initialComments?: Comment[]
}

export function TripDiscussion({ tripId, initialComments = [] }: TripDiscussionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [tripId])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/trips/${tripId}/comments`)
      const data = await response.json()

      if (response.ok && data.comments) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/trips/${tripId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      const data = await response.json()

      if (response.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev])
        setNewComment("")
      } else {
        throw new Error(data.message || "Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 p-4 rounded-lg border">
              <Avatar>
                <AvatarImage src={comment.userImage || "/placeholder.svg"} alt={comment.userName} />
                <AvatarFallback>{comment.userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{comment.userName}</h4>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No comments yet. Be the first to start the discussion!
          </div>
        )}
      </div>
    </div>
  )
}
