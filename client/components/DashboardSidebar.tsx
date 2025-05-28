import { Home, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
  { title: 'Overview', path: '/', icon: Home },
  { title: 'Add Campaigns', path: '/campaigns/add', icon: Plus },
  // { title: 'Create Campaign', path: '/campaigns/create', icon: Plus },
  // { title: 'Profile', path: '/profile', icon: User },
];

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                console.log(item.path, pathname);
                const isActive = item.path === pathname;
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive} onClick={() => handleNavigate(item.path)} className="cursor-pointer">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
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
