"use client"

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export interface WinLossPieData {
  win: number
  lose: number
  draw?: number
}

interface WinLossPieChartProps {
  title?: string
  description?: string
  data: WinLossPieData
}

// ✅ Ikuti struktur chartConfig seperti dokumentasi
const chartConfig = {
  value: {
    label: "Trades",
  },
  win: {
    label: "Win",
    color: "var(--chart-1)",
  },
  lose: {
    label: "Lose",
    color: "var(--chart-2)",
  },
  draw: {
    label: "Draw",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function WinLossPieChart({
  title = "Win/Loss Distribution",
  description = "Ratio of winning vs losing trades",
  data,
}: WinLossPieChartProps) {
  const chartData = [
    { name: "win", value: data.win, fill: "var(--chart-1)" },
    { name: "lose", value: data.lose, fill: "var(--chart-2)" },
  ]

  if (data.draw !== undefined) {
    chartData.push({ name: "draw", value: data.draw, fill: "var(--chart-3)" })
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            {/* ✅ dataKey harus sesuai dengan field di chartData */}
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={5}
            />
            {/* ✅ Legend di bawah, sesuai dokumentasi */}
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
