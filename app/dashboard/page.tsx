"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquityCurveChart } from "@/components/EquityCurveChart";
import { WinLossPieChart } from "@/components/WinLossPieChart";
import { ProfitBarChart } from "@/components/ProfitPerPairChart";
import { getDashboards } from "../store/dashboardStore";
import { Dashboard } from "../type/dashboard";
import { DailyBarChart } from "@/components/DailyBarChart";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboards();
        console.log("Data dashboard:", response.data);
        setDashboard(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!dashboard) {
    return <p className="p-6">No dashboard data available.</p>;
  }

  const cumulativeDaily = (() => {
    if (!dashboard.daily || dashboard.daily.length === 0) return [];
    const sorted = dashboard.daily
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Asumsi starting equity = total equity - total PnL
    let cumulative = dashboard.equity - dashboard.total_pnl;
    return sorted.map((d) => {
      cumulative += d.pnl;
      return { date: d.date, equity: cumulative };
    });
  })();

  return (
    <div className="p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Trading Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Review your trading performance and insights.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equity</CardTitle>
          </CardHeader>
          <CardContent>${dashboard.equity.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total P/L</CardTitle>
          </CardHeader>
          <CardContent>${dashboard.total_pnl.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Risk/Reward</CardTitle>
          </CardHeader>
          <CardContent>{dashboard.avg_rr.toFixed(2)}</CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Equity Curve from Daily */}
        <EquityCurveChart data={cumulativeDaily} />
      </section>
    </div>
  );
}
