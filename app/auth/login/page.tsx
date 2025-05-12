"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case "CredentialsSignin":
        return "Invalid email or password"
      case "OAuthSignin":
      case "OAuthCallback":
        return "Error with OAuth provider. Please try again."
      case "OAuthCreateAccount":
        return "Error creating account with OAuth provider"
      case "EmailCreateAccount":
        return "Error creating account"
      case "Callback":
        return "Error during callback"
      case "OAuthAccountNotLinked":
        return "Account not linked"
      case "EmailSignin":
        return "Error sending email"
      case "SessionRequired":
        return "Please sign in to access this page"
      case "ClientFetch":
        return "Network error. Please check your connection and try again."
      default:
        return "An error occurred during sign in"
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setErrorMessage(getErrorMessage(result.error) || "Invalid email or password")
        toast({
          title: "Error",
          description: getErrorMessage(result.error) || "Invalid email or password",
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        toast({
          title: "Success",
          description: "You have been logged in",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Something went wrong. Please try again.")
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Use the absolute URL for the callback
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      })
    } catch (error) {
      console.error("Google sign-in error:", error)
      setErrorMessage("Failed to sign in with Google. Please try again.")
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <MapPin className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to sign in to your account</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your preferred sign in method</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-md text-red-800 dark:text-red-300 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm font-medium text-primary">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
