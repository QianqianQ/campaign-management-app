import { Home, LayoutGrid, LogOut, Plus } from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DashboardSidebarItem } from "@/types/dashboard";

const sidebarItems: DashboardSidebarItem[] = [
  { title: 'Overview', path: '/', icon: LayoutGrid },
  { title: 'New Campaign', path: '/campaigns/new/', icon: Plus },
  // { title: 'Profile', path: '/profile', icon: User },
];

export function DashboardSidebar() {
  const { user, signout } = useAuth();
  const pathname = usePathname();

  const handleSignOut = () => {
    signout();
  }
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Signout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
