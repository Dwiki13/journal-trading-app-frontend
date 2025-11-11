"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface PerformanceData {
  date: string 
  profit: number
}

interface PerformanceAreaChartProps {
  title?: string
  description?: string
  data: PerformanceData[]
  period?: string
}

export function PerformanceAreaChart({
  title = "Daily / Weekly Performance",
  description = "Shows equity growth or decline over time",
  data,
  period = "Daily",
}: PerformanceAreaChartProps) {
  const totalChange =
    data.length > 1 ? data[data.length - 1].profit - data[0].profit : 0
  const trendingUp = totalChange >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            profit: {
              label: "Profit",
              color: trendingUp ? "var(--chart-1)" : "var(--chart-2)",
            },
          }}
        >
          <AreaChart
            data={data}
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={trendingUp ? "var(--color-win, #10B981)" : "var(--color-lose, #EF4444)"}
              fill={trendingUp ? "var(--color-win, #10B981)" : "var(--color-lose, #EF4444)"}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendingUp ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(totalChange).toLocaleString()} this {period.toLowerCase()}
              {trendingUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing {period.toLowerCase()} performance
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
