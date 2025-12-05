"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Layers,
  Palette,
  Users,
  CircleDot,
  Sparkles,
  Image,
  Home,
  ClipboardList,
  Plus,
} from "lucide-react";

const masterItems = [
  { title: "Fabric", href: "/masters?tab=fabric", icon: Layers },
  { title: "Fabric Color", href: "/masters?tab=fabric-color", icon: Palette },
  { title: "Party", href: "/masters?tab=party", icon: Users },
  { title: "Design", href: "/masters?tab=design", icon: Image },
  { title: "Dori", href: "/masters?tab=dori", icon: CircleDot },
  { title: "5mm Seq", href: "/masters?tab=five-mm-seq", icon: Sparkles },
  { title: "3mm Seq", href: "/masters?tab=three-mm-seq", icon: Sparkles },
  { title: "4mm Beats", href: "/masters?tab=four-mm-beats", icon: CircleDot },
  { title: "3mm Beats", href: "/masters?tab=three-mm-beats", icon: CircleDot },
  {
    title: "2.5mm Beats",
    href: "/masters?tab=two-point-five-mm-beats",
    icon: CircleDot,
  },
];

const orderItems = [
  { title: "New Order", href: "/orders/new", icon: Plus },
  { title: "All Orders", href: "/orders", icon: ClipboardList },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Divine</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Orders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orderItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Masters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/masters" && item.href.includes(pathname)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
