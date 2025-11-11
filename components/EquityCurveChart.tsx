"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface EquityCurveData {
  date: string 
  equity: number
}

interface EquityCurveChartProps {
  title?: string
  description?: string
  data: EquityCurveData[]
}

export function EquityCurveChart({
  title = "Equity Curve",
  description = "Account balance over time",
  data,
}: EquityCurveChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 dark:text-zinc-400">No data available.</p>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    equity: {
      label: "Equity",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  // Hitung tren terakhir untuk footer (optional)
  const firstEquity = data[0].equity
  const lastEquity = data[data.length - 1].equity
  const diff = lastEquity - firstEquity
  const isUp = diff >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Bisa format ke dd/mm atau month short
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="equity"
              type="natural"
              stroke="var(--color-equity)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isUp
            ? `Trending up by $${diff.toLocaleString()}`
            : `Trending down by $${Math.abs(diff).toLocaleString()}`}
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing equity for the last {data.length} periods
        </div>
      </CardFooter>
    </Card>
  )
}
