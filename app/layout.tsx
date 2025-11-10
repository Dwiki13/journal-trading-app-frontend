"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, User } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Import NextIntl

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
  messages = {}, 
  locale = "en",
}: {
  children: React.ReactNode;
  messages?: Record<string, string>;
  locale?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const showSidebar = !pathname?.startsWith("/login");
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        <ThemeProvider attribute="class" defaultTheme="system">
            {showSidebar ? (
              <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <main className="flex-1 p-6 md:p-10 relative">
                  <SidebarTrigger />

                  <div className="absolute top-4 right-4 flex items-center gap-4">
                    <button
                      onClick={toggleTheme}
                      className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    >
                      {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center hover:ring-2 hover:ring-zinc-400 transition">
                          <User size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <a href="/user/settings">User Settings</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {children}
                </main>
              </SidebarProvider>
            ) : (
              <main className="flex-1 w-full">{children}</main>
            )}

            <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}