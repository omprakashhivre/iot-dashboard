"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Activity } from "lucide-react"

interface ChartData {
  times: string[]
  temperature: number[]
  humidity: number[]
  powerUsage: number[]
}

interface LiveChartsProps {
  liveData: ChartData
  connectionStatus: "connected" | "disconnected" | "reconnecting"
}

export function LiveCharts({ liveData, connectionStatus }: LiveChartsProps) {
  const tempChartRef = useRef<HTMLDivElement>(null)
  const humidityChartRef = useRef<HTMLDivElement>(null)
  const powerChartRef = useRef<HTMLDivElement>(null)
  const combinedChartRef = useRef<HTMLDivElement>(null)

  const tempChartInstance = useRef<echarts.ECharts | null>(null)
  const humidityChartInstance = useRef<echarts.ECharts | null>(null)
  const powerChartInstance = useRef<echarts.ECharts | null>(null)
  const combinedChartInstance = useRef<echarts.ECharts | null>(null)

  const [showCombined, setShowCombined] = useState(false)

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-400"
      case "reconnecting":
        return "text-yellow-400"
      case "disconnected":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected"
      case "reconnecting":
        return "Reconnecting..."
      case "disconnected":
        return "Disconnected"
      default:
        return "Unknown"
    }
  }

  const createChartOption = (title: string, data: number[], color: string, unit: string) => ({
    backgroundColor: "transparent",
    title: {
      text: title,
      textStyle: {
        color: "#f1f5f9",
        fontSize: 14,
      },
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        height: 20,
        bottom: 10,
        handleStyle: {
          color: color,
        },
        textStyle: {
          color: "#94a3b8",
        },
        borderColor: "#475569",
        fillerColor: color + "20",
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: liveData.times,
      axisLine: {
        lineStyle: {
          color: "#475569",
        },
      },
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#475569",
        },
      },
      axisLabel: {
        color: "#94a3b8",
        formatter: `{value}${unit}`,
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: "#334155",
        },
      },
    },
    series: [
      {
        name: title,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        data: data,
        lineStyle: {
          color: color,
          width: 2,
        },
        itemStyle: {
          color: color,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: color + "40",
            },
            {
              offset: 1,
              color: color + "00",
            },
          ]),
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1e293b",
      borderColor: "#475569",
      textStyle: {
        color: "#f1f5f9",
      },
      formatter: (params: any) => {
        const point = params[0]
        return `${point.seriesName}<br/>${point.name}<br/>${point.value}${unit}`
      },
    },
  })

  const createCombinedChartOption = () => ({
    backgroundColor: "transparent",
    title: {
      text: "Combined Sensor Data",
      textStyle: {
        color: "#f1f5f9",
        fontSize: 16,
      },
      left: "center",
    },
    legend: {
      data: ["Temperature (°C)", "Humidity (%)", "Power Usage (W)"],
      textStyle: {
        color: "#f1f5f9",
      },
      top: "8%",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "20%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        height: 20,
        bottom: 10,
        handleStyle: {
          color: "#3b82f6",
        },
        textStyle: {
          color: "#94a3b8",
        },
        borderColor: "#475569",
        fillerColor: "#3b82f620",
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: liveData.times,
      axisLine: {
        lineStyle: {
          color: "#475569",
        },
      },
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#475569",
        },
      },
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: "#334155",
        },
      },
    },
    series: [
      {
        name: "Temperature (°C)",
        type: "line",
        smooth: true,
        data: liveData.temperature,
        lineStyle: { color: "#ef4444", width: 2 },
        itemStyle: { color: "#ef4444" },
      },
      {
        name: "Humidity (%)",
        type: "line",
        smooth: true,
        data: liveData.humidity,
        lineStyle: { color: "#3b82f6", width: 2 },
        itemStyle: { color: "#3b82f6" },
      },
      {
        name: "Power Usage (W)",
        type: "line",
        smooth: true,
        data: liveData.powerUsage,
        lineStyle: { color: "#eab308", width: 2 },
        itemStyle: { color: "#eab308" },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1e293b",
      borderColor: "#475569",
      textStyle: {
        color: "#f1f5f9",
      },
    },
  })

  useEffect(() => {
    const initializeCharts = () => {
      // Dispose existing charts
      tempChartInstance.current?.dispose()
      humidityChartInstance.current?.dispose()
      powerChartInstance.current?.dispose()
      combinedChartInstance.current?.dispose()

      if (showCombined) {
        // Initialize combined chart
        if (combinedChartRef.current) {
          combinedChartInstance.current = echarts.init(combinedChartRef.current, "dark")
          combinedChartInstance.current.setOption(createCombinedChartOption())
        }
      } else {
        // Initialize individual charts
        if (tempChartRef.current) {
          tempChartInstance.current = echarts.init(tempChartRef.current, "dark")
          tempChartInstance.current.setOption(createChartOption("Temperature", liveData.temperature, "#ef4444", "°C"))
        }
        if (humidityChartRef.current) {
          humidityChartInstance.current = echarts.init(humidityChartRef.current, "dark")
          humidityChartInstance.current.setOption(createChartOption("Humidity", liveData.humidity, "#3b82f6", "%"))
        }
        if (powerChartRef.current) {
          powerChartInstance.current = echarts.init(powerChartRef.current, "dark")
          powerChartInstance.current.setOption(createChartOption("Power Usage", liveData.powerUsage, "#eab308", "W"))
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeCharts, 100)

    const handleResize = () => {
      tempChartInstance.current?.resize()
      humidityChartInstance.current?.resize()
      powerChartInstance.current?.resize()
      combinedChartInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [showCombined])

  // Update charts when data changes
  useEffect(() => {
    if (showCombined && combinedChartInstance.current) {
      combinedChartInstance.current.setOption(createCombinedChartOption())
    } else {
      if (tempChartInstance.current) {
        tempChartInstance.current.setOption(createChartOption("Temperature", liveData.temperature, "#ef4444", "°C"))
      }
      if (humidityChartInstance.current) {
        humidityChartInstance.current.setOption(createChartOption("Humidity", liveData.humidity, "#3b82f6", "%"))
      }
      if (powerChartInstance.current) {
        powerChartInstance.current.setOption(createChartOption("Power Usage", liveData.powerUsage, "#eab308", "W"))
      }
    }
  }, [liveData, showCombined])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tempChartInstance.current?.dispose()
      humidityChartInstance.current?.dispose()
      powerChartInstance.current?.dispose()
      combinedChartInstance.current?.dispose()
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Sensor Charts</span>
              <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <span className="text-sm">{getStatusText()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCombined(!showCombined)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {showCombined ? "Show Individual" : "Show Combined"}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {showCombined ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div ref={combinedChartRef} className="w-full h-96" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div ref={tempChartRef} className="w-full h-64" />
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div ref={humidityChartRef} className="w-full h-64" />
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div ref={powerChartRef} className="w-full h-64" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
