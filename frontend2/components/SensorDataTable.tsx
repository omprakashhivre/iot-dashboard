"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Filter, RefreshCw } from "lucide-react"
import { sensorAPI, type SensorData, type SensorFilters } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { RoleGuard } from "./RoleGuard"

interface SensorDataTableProps {
  refreshTrigger: number
}

export function SensorDataTable({ refreshTrigger }: SensorDataTableProps) {
  const [data, setData] = useState<SensorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<SensorFilters>({
    limit: 100,
    deviceId: "",
    from: "",
    to: "",
  })
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const cleanFilters: SensorFilters = {}
      if (filters.limit) cleanFilters.limit = filters.limit
      if (filters.deviceId) cleanFilters.deviceId = filters.deviceId
      if (filters.from) cleanFilters.from = filters.from
      if (filters.to) cleanFilters.to = filters.to

      const result = await sensorAPI.getHistory(cleanFilters)
      setData(result)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch sensor data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    try {
      await sensorAPI.deleteSensor(id)
      toast({
        title: "Success",
        description: "Sensor data deleted successfully",
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete sensor data",
        variant: "destructive",
      })
    }
  }

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200 flex items-center justify-between">
          Sensor Data History
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFilterSubmit} className="mb-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="limit" className="text-slate-200 text-sm">
                Limit
              </Label>
              <Input
                id="limit"
                type="number"
                value={filters.limit || ""}
                onChange={(e) => setFilters({ ...filters, limit: Number.parseInt(e.target.value) || undefined })}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="deviceId" className="text-slate-200 text-sm">
                Device ID
              </Label>
              <Input
                id="deviceId"
                value={filters.deviceId || ""}
                onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="device-1"
              />
            </div>
            <div>
              <Label htmlFor="from" className="text-slate-200 text-sm">
                From Date
              </Label>
              <Input
                id="from"
                type="datetime-local"
                value={filters.from || ""}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div>
              <Label htmlFor="to" className="text-slate-200 text-sm">
                To Date
              </Label>
              <Input
                id="to"
                type="datetime-local"
                value={filters.to || ""}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </form>

        <div className="rounded-md border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-200">Device ID</TableHead>
                <TableHead className="text-slate-200">Temperature (°C)</TableHead>
                <TableHead className="text-slate-200">Humidity (%)</TableHead>
                <TableHead className="text-slate-200">Power Usage (W)</TableHead>
                <TableHead className="text-slate-200">Timestamp</TableHead>
                <RoleGuard allowedRoles={["admin"]}>
                  <TableHead className="text-slate-200">Actions</TableHead>
                </RoleGuard>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    Loading sensor data...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No sensor data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((sensor) => (
                  <TableRow key={sensor._id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-slate-300">{sensor.deviceId}</TableCell>
                    <TableCell className="text-slate-300">{sensor.temperature.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-300">{sensor.humidity.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-300">{sensor.powerUsage.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-300">{new Date(sensor.timestamp).toLocaleString()}</TableCell>
                    <RoleGuard allowedRoles={["admin"]}>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-800 border-slate-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Sensor Data</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Are you sure you want to delete this sensor data? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sensor._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </RoleGuard>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
