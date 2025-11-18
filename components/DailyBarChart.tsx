"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DailyBarChartProps {
  title?: string;
  description?: string;
  data: { date: string; pnl: number }[];
}

export function DailyBarChart({
  title = "Daily P/L",
  description = "Profit/Loss per day",
  data,
}: DailyBarChartProps) {
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
    );
  }

  // Sortir tanggal ascending
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartConfig = {
    pnl: {
      label: "P/L",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--foreground)",
    },
  } satisfies ChartConfig;

  // Hitung tren
  const first = sortedData[0].pnl;
  const last = sortedData[sortedData.length - 1].pnl;
  const diff = last - first;
  const isUp = diff >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="date"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis dataKey="pnl" type="number" tickFormatter={(v) => `$${v}`} />
            <ChartTooltip
              cursor={false}
            //   content={<ChartTooltipContent indicator="bar" />}
            />
            <Bar
              dataKey="pnl"
              fill="var(--color-equity)"
              radius={4}
            >
              <LabelList
                dataKey="pnl"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isUp
            ? `Trending up by $${diff}`
            : `Trending down by $${Math.abs(diff)}`}
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily P/L for the last {data.length} days
        </div>
      </CardFooter>
    </Card>
  );
}
