"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CalendarDays, User, GanttChartSquare, Bell, Search } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Lessons', icon: BookOpen },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2 ">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://picsum.photos/seed/student/200" data-ai-hint="person portrait" />
                    <AvatarFallback>
                    <User className="w-5 h-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                    <p className="font-semibold">Student</p>
                    <p className="text-muted-foreground">Grade 12</p>
                </div>
            </div>
            <Button variant="ghost" size="icon">
                <Bell className="size-5" />
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
           <div className="p-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <SidebarInput placeholder="Search..." className="pl-9" />
              </div>
           </div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  className="justify-start"
                  tooltip={{
                    children: item.label,
                    side: 'right',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger/>
           <div className="flex-1" />
           <Button variant="ghost" size="icon">
                <Search className="size-5" />
            </Button>
           <Button variant="ghost" size="icon">
                <Bell className="size-5" />
            </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
