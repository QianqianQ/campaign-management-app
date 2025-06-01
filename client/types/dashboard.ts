/**
 * Dashboard types
 */

export interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export interface DashboardSidebarItem {
    title: string;
    path: string;
    icon?: React.ElementType;
}