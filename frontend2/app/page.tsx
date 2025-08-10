"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
}
