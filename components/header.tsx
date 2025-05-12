"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-xl hidden sm:inline-block">TripMaker</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            {/* Commenting out links to pages that don't exist yet 
            <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            */}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-4">
              {/* <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link> */}
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
            </nav>
            <div className="border-t pt-4">
              {session ? (
                <div className="flex flex-col gap-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      Settings
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
