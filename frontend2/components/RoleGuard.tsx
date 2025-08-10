"use client"

import type React from "react"

import { useUser } from "@/contexts/UserContext"

interface RoleGuardProps {
  allowedRoles: ("admin" | "user")[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useUser()

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
