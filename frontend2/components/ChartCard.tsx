"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  data: Array<{ value: number; timestamp: string }>
  color: string
  unit: string
}

export function ChartCard({ title, data, color, unit }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, "dark")
    }

    const option = {
      backgroundColor: "transparent",
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => new Date(item.timestamp).toLocaleTimeString()),
        axisLine: { lineStyle: { color: "#475569" } },
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#475569" } },
        axisLabel: { color: "#94a3b8", formatter: `{value}${unit}` },
        splitLine: { lineStyle: { color: "#334155" } },
      },
      series: [
        {
          name: title,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: data.map((item) => item.value),
          lineStyle: { color, width: 3 },
          itemStyle: { color },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color + "40" },
              { offset: 1, color: color + "00" },
            ]),
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1e293b",
        borderColor: "#475569",
        textStyle: { color: "#f1f5f9" },
        formatter: (params: any) => {
          const point = params[0]
          return `${point.seriesName}<br/>${point.name}<br/>${point.value}${unit}`
        },
      },
    }

    chartInstance.current.setOption(option)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, color, title, unit])

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-64" />
      </CardContent>
    </Card>
  )
}
