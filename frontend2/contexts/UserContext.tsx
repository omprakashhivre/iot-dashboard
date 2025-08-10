"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authUtils, type AuthData } from "@/lib/auth"

interface User {
  token: string
  role: "admin" | "user"
  email?: string
}

interface UserContextType {
  user: AuthData | null
  login: (username: string, role: "admin" | "user", token: string) => void
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored auth data on mount
    const authData = authUtils.getAuthData()

    if (authData) {
      setUser(authData)
      // If user is on login or register page but authenticated, redirect to dashboard
      if (pathname === "/login" || pathname === "/register") {
        router.replace("/dashboard")
      }
    } else {
      // If user is not authenticated and trying to access protected route
      if (pathname !== "/login" && pathname !== "/register" && pathname !== "/") {
        router.replace("/login")
      }
    }

    setIsLoading(false)
  }, [pathname, router])

  const login = (username: string, role: "admin" | "user", token: string) => {
    const authData: AuthData = { username, role, token }

    if (authUtils.setAuthData(authData)) {
      setUser(authData)
      router.replace("/dashboard")
    } else {
      console.error("Failed to store authentication data")
    }
  }

  const logout = () => {
    authUtils.clearAuthData()
    setUser(null)
    router.replace("/login")
  }

  const isAuthenticated = !!user?.token

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
