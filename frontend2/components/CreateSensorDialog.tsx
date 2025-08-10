"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { sensorAPI, type CreateSensorData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CreateSensorDialogProps {
  onSensorCreated: () => void
}

export function CreateSensorDialog({ onSensorCreated }: CreateSensorDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateSensorData>({
    deviceId: "",
    temperature: 0,
    humidity: 0,
    powerUsage: 0,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sensorAPI.createSensor({
        ...formData,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "Sensor data created successfully",
      })

      setOpen(false)
      setFormData({
        deviceId: "",
        temperature: 0,
        humidity: 0,
        powerUsage: 0,
      })
      onSensorCreated()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create sensor data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Sensor Data
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Sensor Data</DialogTitle>
          <DialogDescription className="text-slate-400">Add new sensor reading to the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceId" className="text-right">
                Device ID
              </Label>
              <Input
                id="deviceId"
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                className="col-span-3 bg-slate-700 border-slate-600"
                placeholder="device-1"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature" className="text-right">
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.01"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: Number.parseFloat(e.target.value) })}
                className="col-span-3 bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="humidity" className="text-right">
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                step="0.01"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: Number.parseFloat(e.target.value) })}
                className="col-span-3 bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="powerUsage" className="text-right">
                Power Usage (W)
              </Label>
              <Input
                id="powerUsage"
                type="number"
                step="0.01"
                value={formData.powerUsage}
                onChange={(e) => setFormData({ ...formData, powerUsage: Number.parseFloat(e.target.value) })}
                className="col-span-3 bg-slate-700 border-slate-600"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Sensor Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
