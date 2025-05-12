"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  useEffect(() => {
    // Add a global error handler for NextAuth client errors
    const handleError = (event: ErrorEvent) => {
      if (event.error && event.error.message && event.error.message.includes("next-auth")) {
        console.error("NextAuth error:", event.error)
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        })
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [toast])

  return <SessionProvider>{children}</SessionProvider>
}
