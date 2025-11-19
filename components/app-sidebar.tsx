import { Calendar, Database, Home, Users, Settings, ChevronDown, Book, DatabaseIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  // { 
  //   title: "Master", 
  //   icon: Database,
  //   submenu: [
  //     { title: "Master Store", url: "/master/store" },
  //     { title: "Master Service", url: "/master/service" },
  //     { title: "Master Store Service", url: "/master/store-service" },
  //   ]
  // },
  { title: "Data Journal", url: "/data-journal", icon: DatabaseIcon },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Journal Trading
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                        {item.submenu.map((sub) => (
                          <DropdownMenuItem key={sub.title}>
                            <a href={sub.url}>{sub.title}</a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}