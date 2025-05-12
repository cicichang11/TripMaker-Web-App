"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "Configuration":
        return "There is a problem with the server configuration. Check if your Google OAuth credentials are set up correctly."
      case "AccessDenied":
        return "You do not have permission to sign in."
      case "Verification":
        return "The verification failed. The token might have expired or been used already."
      case "OAuthSignin":
        return "Error in the OAuth sign-in process. Please try again."
      case "OAuthCallback":
        return "Error in the OAuth callback process. This could be due to a misconfigured redirect URI."
      case "OAuthCreateAccount":
        return "Could not create an OAuth account. You might already have an account with a different sign-in method."
      case "EmailCreateAccount":
        return "Could not create an email account. You might already have an account with a different sign-in method."
      case "Callback":
        return "The callback process failed. This could be due to a server error."
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using the original account."
      case "EmailSignin":
        return "Error sending the email. Please try again."
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password."
      case "SessionRequired":
        return "You must be signed in to access this page."
      default:
        return "An unknown error occurred. Please try again."
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <MapPin className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">There was a problem signing you in</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Error
            </CardTitle>
            <CardDescription>Authentication failed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-md text-red-800 dark:text-red-300">
              <p>{getErrorMessage(error)}</p>
              {error === "OAuthCallback" && (
                <p className="mt-2 text-sm">
                  Make sure your Google OAuth redirect URI is set to:{" "}
                  <code className="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">
                    https://v0-group-travel-planning.vercel.app/api/auth/callback/google
                  </code>
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Try Again</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
