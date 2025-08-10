"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { sensorAPI, type SensorData } from "@/lib/api"
import { socketManager } from "@/lib/socket"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { RoleGuard } from "@/components/RoleGuard"
import { LiveStats } from "@/components/LiveStats"
import { LiveCharts } from "@/components/LiveCharts"
import { CreateSensorDialog } from "@/components/CreateSensorDialog"
import { SensorDataTable } from "@/components/SensorDataTable"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, User, Activity, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChartData {
  times: string[]
  temperature: number[]
  humidity: number[]
  powerUsage: number[]
}

export default function DashboardPage() {
  const { user, logout } = useUser()
  const { toast } = useToast()
  const [latestData, setLatestData] = useState<SensorData | null>(null)
  const [chartData, setChartData] = useState<ChartData>({
    times: [],
    temperature: [],
    humidity: [],
    powerUsage: [],
  })
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">(
    "disconnected",
  )
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const maxPoints = 30 // Keep last 30 data points for charts

  // Add state for tracking highest and lowest values after the existing state declarations
  const [highestValues, setHighestValues] = useState({
    temperature: Number.NEGATIVE_INFINITY,
    humidity: Number.NEGATIVE_INFINITY,
    powerUsage: Number.NEGATIVE_INFINITY,
  })
  const [lowestValues, setLowestValues] = useState({
    temperature: Number.POSITIVE_INFINITY,
    humidity: Number.POSITIVE_INFINITY,
    powerUsage: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    if (!user?.token) return

    // Fetch latest data on mount
    const fetchLatestData = async () => {
      try {
        const latest = await sensorAPI.getLatest()
        setLatestData(latest)
      } catch (error) {
        console.error("Failed to fetch latest data:", error)
      }
    }

    // Setup WebSocket connection
    const socket = socketManager.connect(user.token)

    socket.on("connect", () => {
      console.log("Connected to WebSocket")
      setConnectionStatus("connected")
      toast({
        title: "Connected",
        description: "Real-time monitoring active",
      })
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket")
      setConnectionStatus("disconnected")
    })

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...")
      setConnectionStatus("reconnecting")
    })

    socket.on("reconnect_failed", () => {
      console.log("Reconnection failed")
      setConnectionStatus("disconnected")
      toast({
        title: "Connection Failed",
        description: "Failed to reconnect to real-time data",
        variant: "destructive",
      })
    })

    // Update the sensor:update event handler to track highest/lowest values
    socket.on("sensor:update", (reading: SensorData) => {
      console.log("Received sensor update:", reading)

      setLatestData(reading)

      // Update highest and lowest values
      setHighestValues((prev) => ({
        temperature: Math.max(prev.temperature, reading.temperature),
        humidity: Math.max(prev.humidity, reading.humidity),
        powerUsage: Math.max(prev.powerUsage, reading.powerUsage),
      }))

      setLowestValues((prev) => ({
        temperature: Math.min(prev.temperature, reading.temperature),
        humidity: Math.min(prev.humidity, reading.humidity),
        powerUsage: Math.min(prev.powerUsage, reading.powerUsage),
      }))

      // Update chart data with sliding window
      setChartData((prevData) => {
        const newTimes = [...prevData.times, new Date(reading.timestamp).toLocaleTimeString()]
        const newTemperature = [...prevData.temperature, reading.temperature]
        const newHumidity = [...prevData.humidity, reading.humidity]
        const newPowerUsage = [...prevData.powerUsage, reading.powerUsage]

        // Keep only last maxPoints
        if (newTimes.length > maxPoints) {
          newTimes.shift()
          newTemperature.shift()
          newHumidity.shift()
          newPowerUsage.shift()
        }

        return {
          times: newTimes,
          temperature: newTemperature,
          humidity: newHumidity,
          powerUsage: newPowerUsage,
        }
      })
    })

    fetchLatestData()

    return () => {
      socketManager.disconnect()
    }
  }, [user?.token, toast])

  const handleSensorCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">IoT Dashboard</h1>
                    <p className="text-sm text-slate-400">Welcome back, {user?.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <RoleGuard allowedRoles={["admin"]}>
                    <CreateSensorDialog onSensorCreated={handleSensorCreated} />
                  </RoleGuard>
                  <div className="flex items-center space-x-2 text-slate-300">
                    {user?.role === "admin" ? (
                      <Shield className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-sm capitalize">{user?.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto px-4 py-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Latest Sensor Reading</h2>
              <LiveStats data={latestData} highestValues={highestValues} lowestValues={lowestValues} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Real-time Charts</h2>
              <LiveCharts liveData={chartData} connectionStatus={connectionStatus} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  Sensor Data History
                </h2>
              </div>
              <SensorDataTable refreshTrigger={refreshTrigger} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
