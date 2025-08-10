"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Zap, TrendingUp, Cpu, TrendingDown } from "lucide-react"
import type { SensorData } from "@/lib/api"

interface LiveStatsProps {
  data: SensorData | null
  highestValues: {
    temperature: number
    humidity: number
    powerUsage: number
  }
  lowestValues: {
    temperature: number
    humidity: number
    powerUsage: number
  }
}

export function LiveStats({ data, highestValues, lowestValues }: LiveStatsProps) {
  const stats = [
    {
      title: "Device ID",
      value: data?.deviceId || "--",
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      highest: null,
      lowest: null,
    },
    {
      title: "Temperature",
      value: data?.temperature ? `${data.temperature.toFixed(1)}°C` : "--",
      icon: Thermometer,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      highest:
        highestValues.temperature !== Number.NEGATIVE_INFINITY ? `${highestValues.temperature.toFixed(1)}°C` : "--",
      lowest: lowestValues.temperature !== Number.POSITIVE_INFINITY ? `${lowestValues.temperature.toFixed(1)}°C` : "--",
    },
    {
      title: "Humidity",
      value: data?.humidity ? `${data.humidity.toFixed(1)}%` : "--",
      icon: Droplets,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      highest: highestValues.humidity !== Number.NEGATIVE_INFINITY ? `${highestValues.humidity.toFixed(1)}%` : "--",
      lowest: lowestValues.humidity !== Number.POSITIVE_INFINITY ? `${lowestValues.humidity.toFixed(1)}%` : "--",
    },
    {
      title: "Power Usage",
      value: data?.powerUsage ? `${data.powerUsage.toFixed(1)}W` : "--",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      highest: highestValues.powerUsage !== Number.NEGATIVE_INFINITY ? `${highestValues.powerUsage.toFixed(1)}W` : "--",
      lowest: lowestValues.powerUsage !== Number.POSITIVE_INFINITY ? `${lowestValues.powerUsage.toFixed(1)}W` : "--",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-slate-200">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
            {stat.highest && stat.lowest && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>High: {stat.highest}</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>Low: {stat.lowest}</span>
                  </div>
                </div>
              </div>
            )}
            {data && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
