"use client";

import Link from "next/link";
import { useState } from "react";
import { useLayoutStore } from "@/app/store/layout";

export default function Sidebar() {
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const { isSidebarOpen } = useLayoutStore();

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-zinc-900 dark:bg-zinc-800 text-zinc-50 flex flex-col transition-all duration-300`}
    >
      <div className="px-4 py-4 text-xl font-bold border-b border-zinc-700">
        {isSidebarOpen ? "UMKM Dashboard" : "UM"}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
        >
          {isSidebarOpen ? "Dashboard" : "D"}
        </Link>

        {/* Master Menu */}
        <div>
          <button
            className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
            onClick={() => setIsMasterOpen(!isMasterOpen)}
          >
            {isSidebarOpen ? "Master" : "M"}
            {isSidebarOpen && (isMasterOpen ? "▾" : "▸")}
          </button>
          {isMasterOpen && isSidebarOpen && (
            <div className="ml-4 mt-2 flex flex-col space-y-1">
              <Link
                href="/dashboard/master/store"
                className="px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
              >
                Master Store
              </Link>
              <Link
                href="/dashboard/master/service"
                className="px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
              >
                Master Service
              </Link>
              <Link
                href="/dashboard/master/store-service"
                className="px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
              >
                Master Store Service
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/user"
          className="block px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
        >
          {isSidebarOpen ? "User Management" : "U"}
        </Link>
      </nav>
    </aside>
  );
}