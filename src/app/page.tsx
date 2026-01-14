"use client";

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowRight, Book, TestTube, Globe, Plus } from 'lucide-react';

const subjects = [
  { name: "Filipino", icon: Book },
  { name: "English", icon: Book },
  { name: "Math", icon: TestTube },
  { name: "Science", icon: TestTube },
  { name: "TLE", icon: Globe },
  { name: "MAPEH", icon: Globe },
  { name: "A.P.", icon: Globe },
  { name: "Values Ed.", icon: Globe },
];

export default function Home() {
  const { tasks } = useTasks();
  const upcomingTasks = tasks.filter(t => !t.isCompleted).slice(0, 2);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Hi, Student</h1>
        <p className="text-muted-foreground">You have {tasks.filter(t => !t.isCompleted).length} pending tasks.</p>
      </header>

      {/* Upcoming Tasks Section */}
      <section>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 pb-4">
            {upcomingTasks.map(task => (
              <Card key={task.id} className="w-64 bg-gradient-to-br from-primary/20 to-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">{task.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{task.taskName}</p>
                  <p className="text-sm text-muted-foreground">{task.dueDate}</p>
                </CardContent>
              </Card>
            ))}
             <Card className="w-64 border-dashed flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="text-lg">All caught up!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">Log a new task to see it here.</p>
                </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Lessons Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          <Button variant="ghost" asChild>
            <Link href="/tasks">
              See All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {subjects.slice(0, 4).map(subject => (
            <Card key={subject.name} className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent transition-colors cursor-pointer">
              <subject.icon className="w-8 h-8 mb-2 text-primary" />
              <span className="font-semibold">{subject.name}</span>
            </Card>
          ))}
        </div>
      </section>
      
       {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
         <Button size="icon" className="h-16 w-16 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600">
          <Plus className="h-8 w-8" />
        </Button>
      </div>

    </div>
  );
}
