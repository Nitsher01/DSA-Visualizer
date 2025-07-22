
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  GitCommit,
  GitMerge,
  Binary,
  Container,
  LayoutGrid,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/array", icon: LayoutGrid, label: "Array" },
  { href: "/stack", icon: GitCommit, label: "Stack" },
  { href: "/queue", icon: GitMerge, label: "Queue" },
  { href: "/heap", icon: Binary, label: "Heap" },
  { href: "/hashmap", icon: Hash, label: "HashMap" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Button asChild variant="ghost" className="w-full justify-start text-lg px-2">
              <Link href="/">
                <Container className="mr-2 h-5 w-5" />
                DSA Visualizer
              </Link>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Visualizers</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="flex items-center p-2 border-b lg:hidden">
              <SidebarTrigger />
            </div>
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
