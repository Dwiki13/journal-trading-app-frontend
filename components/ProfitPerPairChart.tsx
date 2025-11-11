"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export interface ProfitPerPair {
  pair: string
  profit: number
}

interface ProfitBarChartProps {
  title?: string
  description?: string
  data: ProfitPerPair[]
}

export function ProfitBarChart({
  title = "Profit per Instrument",
  description = "Profit or loss per trading pair",
  data,
}: ProfitBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardContent>{description}</CardContent>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 dark:text-zinc-400">No data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ profit: { label: "Profit", color: "var(--chart-1)" } }}>
          <BarChart
            data={data}
            margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="pair"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="profit" radius={4}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                   fill={entry.profit >= 0 ? "var(--chart-1)" : "var(--chart-2)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total profit: $
          {data.reduce((sum, d) => sum + d.profit, 0).toLocaleString()}
          {data.reduce((sum, d) => sum + d.profit, 0) >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing profit for each trading pair
        </div>
      </CardFooter>
    </Card>
  )
}
