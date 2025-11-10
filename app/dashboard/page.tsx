import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreIcon, UsersIcon, SettingsIcon } from "lucide-react";

export const metadata = {
  title: "Journal Trading",
};
export default function DashboardPage() {

  
  return (
    <div className="p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome back! Here's an overview of your application.
        </p>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <StoreIcon className="text-zinc-600 dark:text-zinc-300" />
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">You have 12 active store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <UsersIcon className="text-zinc-600 dark:text-zinc-300" />
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">24 users registered this week.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <SettingsIcon className="text-zinc-600 dark:text-zinc-300" />
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">You have 5 pending configurations.</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder content */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">
              No recent activity to show. Start using your dashboard!
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}