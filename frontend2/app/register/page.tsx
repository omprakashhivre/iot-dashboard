"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Activity, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated, isLoading: authLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username is required")
      return false
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register(username, password)

      // Handle the API response - adjust based on your actual API response structure
      const { username: returnedUsername, role, token } = response

      if (token && role && returnedUsername) {
        login(returnedUsername, role, token)
      } else {
        setError("Invalid response from server")
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Don't render register form if user is authenticated
  if (isAuthenticated) {
        return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join IoT Dashboard</h1>
          <p className="text-slate-400">Create your account to start monitoring</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your details to create your new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500"
                />
              </div>

              {error && (
                <Alert className="bg-red-900/50 border-red-700 text-red-200">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                By creating an account, you agree to monitor your IoT devices responsibly
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
