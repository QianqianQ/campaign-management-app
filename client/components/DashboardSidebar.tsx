import { Home, LayoutGrid, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface SidebarItem {
  title: string;
  path: string;
  icon?: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Overview', path: '/', icon: LayoutGrid },
  { title: 'New Campaign', path: '/campaigns/new/', icon: Plus },
  // { title: 'Profile', path: '/profile', icon: User },
];

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-80 transition-opacity">
            <Home className="h-4 w-4" />
          </Link>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user ? user.email : 'Dashboard'}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = item.path === pathname;
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.path} className="cursor-pointer">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
