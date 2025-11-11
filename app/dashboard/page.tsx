"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquityCurveChart } from "@/components/EquityCurveChart";
import { getJournals } from "@/app/store/journalStore";
import { Journal, EquityPoint } from "@/app/type/journal";
import { WinLossPieChart } from "@/components/WinLossPieChart";
import {
  ProfitBarChart,
  ProfitPerPair,
} from "@/components/ProfitPerPairChart";
// import { AreaPerformanceChart } from "@/components/AreaPerformanceChart"; // nanti bisa pakai ini

export default function DashboardPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [equityData, setEquityData] = useState<EquityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await getJournals({
          page: 1,
          limit: 100,
          sort_by: "tanggal",
          sort_order: "asc",
        });
        setJournals(response.data);

        let equity = 0;
        const equityPoints: EquityPoint[] = response.data.map((j) => {
          equity += j.profit;
          return { date: j.tanggal, equity };
        });
        setEquityData(equityPoints);
      } catch (err) {
        console.error("Failed to fetch journals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // ✅ Hitung Win/Loss dinamis
  const winCount = journals.filter((j) => j.win_lose === "win").length;
  console.log("win data", winCount)
  const loseCount = journals.filter((j) => j.win_lose === "lose").length;
  const totalPL = journals.reduce((acc, j) => acc + j.profit, 0);

  return (
    <div className="p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Journal Trading Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Review your trading performance and insights.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Trades</CardTitle>
          </CardHeader>
          <CardContent>{journals.length} Trades</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {((winCount / (journals.length || 1)) * 100).toFixed(1)}%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total P/L</CardTitle>
          </CardHeader>
          <CardContent>${totalPL.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Risk/Reward</CardTitle>
          </CardHeader>
          <CardContent>1:2.3</CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Equity Curve */}
        <EquityCurveChart data={equityData} />

        {/* ✅ Win/Loss Pie Chart langsung dipakai */}
        <WinLossPieChart
          data={{
            win: winCount,
            lose: loseCount,
          }}
          title="Win/Loss Ratio"
          description="Proportion of winning vs losing trades"
        />

        {/* ✅ Profit per Instrument */}
        <ProfitBarChart
          data={journals.reduce<ProfitPerPair[]>((acc, j) => {
            const existing = acc.find((i) => i.pair === j.pair);
            if (existing) existing.profit += j.profit;
            else acc.push({ pair: j.pair, profit: j.profit });
            return acc;
          }, [])}
        />

        {/* ✅ AreaChart (Daily/Weekly Performance) — nanti diganti dengan komponen kamu */}
        {/* <AreaPerformanceChart
          data={equityData}
          title="Daily/Weekly Performance"
          description="Shows equity growth trend"
        /> */}
      </section>
    </div>
  );
}
